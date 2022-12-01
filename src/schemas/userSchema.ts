import { object, union, literal, string, z } from 'zod';

export const CreateUserSchema = object({
  email: string({ required_error: 'Email is required' }).email(
    'Invalid email'
  ),
  firstName: string({ required_error: 'First Name is required' }),
  lastName: string({ required_error: 'Last Name is required' }),
  password: string({ required_error: 'Password is required' })
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string({ required_error: 'Please confirm your password' }),
  jobDetails: object({
    jobName: union([
      literal('student'),
      literal('academician'),
      literal('employee')
    ], {required_error: 'Job Name is required. It should be one of: "student", "academician", "employee"'}),
    companyInfo: object({
      companyName: string(),
      department: string(),
      title: string(),
      expertise: string()
    }).optional()
  }),
  socialAccounts: object({
    twitter: string().optional(),
    facebook: string().optional(),
    linkedin: string().optional(),
    googleScholar: string().optional(),
  }),
  reCaptcha: string({ required_error: 'ReCaptcha code is required' }),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
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
