import { object, string, z } from 'zod';

export const mailList = [
  "brisa.com.tr",
  "kordsa.com",
  "akcansa.com.tr",
  "cimsa.com.tr",
  "teknosa.com",
  "carrefoursa.com",
  "sabanci.com",
  "temsa.com",
  "akportfoy.com.tr",
  "akbank.com",
  "sabanciuniv.edu"
]
export const CreateUserSchema = object({
  email: string({ required_error: 'Email is required' }).email().refine((data) => {
    const company = data.split('@')[1];
    if (mailList.indexOf(company) === -1) {
      return false;
    }
    return true;
  }, {message: 'The mail is not in the collaboration list, please make contact with admin.'}),
  fullName: string({ required_error: 'First Name is required' }),
  password: string({ required_error: 'Password is required' })
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  re_password: string({ required_error: 'Please confirm your password' }),
  role: string({ required_error: "Role is required" })
}).refine((data) => data.password === data.re_password, {
  path: ['re_password'],
  message: 'Passwords do not match',
});

export const LoginUserSchema = object({
  email: string({ required_error: 'Email is required' }).email(
    'Invalid email or password'
  ),
  password: string({ required_error: 'Password is required' }).min(
    8,
    'Invalid email or password'
  ),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type LoginUserInput = z.infer<typeof LoginUserSchema>
