import { Types } from 'mongoose';


export interface CompanyInfo {
  companyName: string;
  department: string;
  title: string;
  expertise: string;
}

export interface SocialAccounts {
  twitter?: string;
  facebook?: string;
  googleScholar?: string;
  linkedin?: string;
}

export interface IUser {
  save(): IUser | PromiseLike<IUser>;
  _id: Types.ObjectId;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  company: string;
  department: string;
  about: string;
  image: string;
  socialAccounts: SocialAccounts;
}