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
  fullName: string;
  password: string;
  role: string;
  jobDetails: {
    jobName: 'student' | 'academician' | 'employee';
    companyInfo?: CompanyInfo;
  }
  socialAccounts: SocialAccounts;
}