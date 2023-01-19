import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { CheckIfUserExistsInDatabase, CreateUser, GetUser, GetUserByEmail, GetUserByUsername } from './database/user.functions';
import { BadRequestError, InternalServerError } from './helpers/responseHandler';
import { CreateUserInput, CreateUserSchema, LoginUserInput, LoginUserSchema } from './schemas/userSchema';
import { getAccessToken, getRefreshToken, verifyAccessToken, verifyRefreshToken } from './helpers/jwtHelper';
import setResponseCookie from './helpers/cookieHelper';
import { dbConnection } from './database';
import { redisConnection } from './database/redisConnection';
import app from './router';
import { ITokenPayload } from './types';
import { CreateProject, EditProject, GetProjectDetails, GetProjectDetailsOfUser, GetProjects } from './database/project.functions';

dotenv.config({ path: `./.env` });

app.get('/healthcheck', async (req, res) => {
  return { status: true }
})

app.register(
  function(api, opts, done) {
    api.get('/me', async (req, reply) => {
      let payload: ITokenPayload | null;
      const accessToken = verifyAccessToken(req.cookies.access_token as string);
      payload = accessToken;
      if (!accessToken) {
        const refreshToken = await verifyRefreshToken(req.cookies.refresh_token as string);
        if (!refreshToken) {
          return {
            status: false,
            message: "User is not authenticated."
          }
        }
        payload = {
          userId: refreshToken.userId,
          email: refreshToken.email
        }
      }
      const userId = payload?.userId;
      const user = await GetUser(userId || null);
      if (!user) {
        return {
          status: false,
          message: "User is not authenticated."
        }
      }
      return {
        email: user.email,
        fullName: user.firstName + " " + user.lastName,
        role: user.role
      }
    })
    api.post('/login', async (req, reply) => {
      try {
        const { email, password }: LoginUserInput = req.body as LoginUserInput;
        const validator = LoginUserSchema.safeParse(req.body);
        if (!validator.success) {
          console.log(validator.error);
          return BadRequestError(reply, validator.error.issues[0].message);
        }
        const user = await GetUserByEmail(email);
        if (!user) {
          return BadRequestError(reply, 'User is not found.');
        }
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
          return BadRequestError(reply, 'Password is wrong.');
        }
        const accessToken = await getAccessToken(user._id.toString(), email);
        const refreshToken = await getRefreshToken(user._id.toString(), email);
        setResponseCookie(reply, accessToken, refreshToken);
        return {
          message: "Successfully logged in to the app!"
        }
      }
      catch (err) {
        return InternalServerError(reply);
      }
    })
    api.post('/register', async (req, reply) => {
      try {
        const { email, fullName, password, role}: CreateUserInput = req.body as CreateUserInput;
        const validator = CreateUserSchema.safeParse(req.body);
        if (!validator.success) {
          console.log(validator.error);
          return BadRequestError(reply, validator.error.issues[0].message);
        }
        const isUserExists = await CheckIfUserExistsInDatabase(email);
        if (isUserExists) {
          return BadRequestError(reply, 'This email is used by another user.');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = await CreateUser({
          email,
          fullName,
          password: hashedPassword,
          role,
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
    api.post('/addProject', async(req, reply) => {
      let payload: ITokenPayload | null;
      console.log(req.cookies);
      const accessToken = verifyAccessToken(req.cookies.access_token as string);
      payload = accessToken;
      if (!accessToken) {
        const refreshToken = await verifyRefreshToken(req.cookies.refresh_token as string);
        if (!refreshToken) {
          return {
            status: false,
            message: "User is not authenticated."
          }
        }
        payload = {
          userId: refreshToken.userId,
          email: refreshToken.email
        }
      }
      const userId = payload?.userId;
      const {
        title,
        description,
        tags,
        members,
      } = req.body as {
        title: string,
        description: string,
        tags: string[]
        members: string[],
      };
      const projectData = {
        title,
        description,
        tags,
        members,
        owner: new Types.ObjectId(userId as string),
      }
      const id = await CreateProject(projectData);
      return {
        statusCode: 200,
        projectId: id,
      }
    })
    api.get('/getProfile', async(req, reply) => {
      let payload: ITokenPayload | null;
      const accessToken = verifyAccessToken(req.cookies.access_token as string);
      payload = accessToken;
      if (!accessToken) {
        const refreshToken = await verifyRefreshToken(req.cookies.refresh_token as string);
        if (!refreshToken) {
          return {
            status: false,
            message: "User is not authenticated."
          }
        }
        payload = {
          userId: refreshToken.userId,
          email: refreshToken.email
        }
      }
      const userId = payload?.userId;
      let user;
      if (!(req.query as any).username) {
        user = await GetUser(userId as string);
      }
      else {
        user = await GetUserByUsername((req.query as any).username)
      }
      if (!user) {
        return {
          status: false,
          message: "There is no user."
        }
      }
      const projects = await GetProjectDetailsOfUser(user._id.toString());
      return {
        owner: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          department: user.department,
          about: user.about,
          image: user.image
        },
        projects,
      }
    })
    api.get('/getProjects', async(req, reply) => {
      const searchValue = (req.query as any).searchInput;
      const projects = await GetProjects(searchValue || null);
      if (!projects || projects.length === 0) {
        return {
          statusCode: 200,
          projects: []
        }
      }
      return projects;
    })
    api.post('/editProject', async(req, reply) => {
      let payload: ITokenPayload | null;
      const accessToken = verifyAccessToken(req.cookies.access_token as string);
      payload = accessToken;
      if (!accessToken) {
        const refreshToken = await verifyRefreshToken(req.cookies.refresh_token as string);
        if (!refreshToken) {
          return {
            status: false,
            message: "User is not authenticated."
          }
        }
        payload = {
          userId: refreshToken.userId,
          email: refreshToken.email
        }
      }
      const userId = payload?.userId;
      const projectId = (req.query as any).projectId;
      const {
        title,
        description,
        tags,
        members,
      } = req.body as {
        title: string,
        description: string,
        tags: string[]
        members: string[],
      };
      const projectData = {
        title,
        description,
        tags,
        members,
        owner: new Types.ObjectId(userId as string),
      }
      await EditProject(projectId, projectData);
      return {
        statusCode: 200,
        projectId,
      }
    })
    api.get('/getProjectDetails', async(req, reply) => {
      const projectDetails = await GetProjectDetails((req.query as any).projectId);
      if (!projectDetails) {
        return {
          statusCode: 400
        };
      }
      return {
        statusCode: 200,
        project: projectDetails,
      }
    })

    done()
  },
  {
    prefix: '/'
  }
)



const start = async () => {
  console.clear();
  try {
    redisConnection();
    dbConnection();
    await app.listen({ port: Number(process.env.PORT  || 4000) })
  } catch (err) {
    app.log.error(err)
    // kill all the process, let tini handle it.
    process.exit(1)
  }
}
start()