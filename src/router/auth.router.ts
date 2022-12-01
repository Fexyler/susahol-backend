import bcrypt from 'bcryptjs';
import axios from 'axios';
import { CheckIfUserExistsInDatabase, CreateUser } from '../database/user.functions';
import { BadRequestError, InternalServerError } from '../helpers/responseHandler';
import { CreateUserInput, CreateUserSchema } from '../schemas/userSchema';
import config from '../config';
import app from './index';
import { getAccessToken, getRefreshToken } from 'helpers/jwtHelper';
import setResponseCookie from 'helpers/cookieHelper';

app.register(
  function(api, opts, done) {
    api.addHook('onRequest', async (req: IRequest, res) => {
      if (req.user) {
        return done(new Error('User is Authenticated.'));
      }
    }) 

    api.get('/me', async () => {
      return { hello: 'world' }
    })
    api.post('/register', async (req, reply) => {
      try {
        const { email, firstName, lastName, password, jobDetails, socialAccounts, reCaptcha}: CreateUserInput = req.body as CreateUserInput;

        const secret = config.reCaptchaSecret;

        const captchaResult = await axios.get<{ success: boolean }>(
          `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${reCaptcha}`,
        );

        if (!captchaResult.data.success) {
          return BadRequestError(reply, 'Failed Captcha verification');
        }

        const validator = CreateUserSchema.safeParse(req.body);
        if (!validator.success) {
          return BadRequestError(reply, validator.error);
        }
        const isUserExists = await CheckIfUserExistsInDatabase(email);
        if (isUserExists) {
          return BadRequestError(reply, 'This email is used by another user.');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = await CreateUser({
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role: 'user',
          jobDetails,
          socialAccounts,
        });
        const accessToken = await getAccessToken(userId, email);
        const refreshToken = await getRefreshToken(userId, email);
        setResponseCookie(reply, accessToken, refreshToken);
        return {
          message: "Successfully registered to the app!"
        }
      }
      catch (err) {
        return InternalServerError(reply);
      }
    })

    done()
  },
  {
    prefix: '/auth'
  }
)