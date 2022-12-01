import { User } from './index';

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


export interface IUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string; //NOTE: Hashed password
  role: 'user' | 'manager';
  jobDetails: {
    // NOTE: Company info is nullable, when it is a student etc.
    jobName: 'student' | 'academician' | 'employee';
    companyInfo?: CompanyInfo;
  }
  socialAccounts: SocialAccounts;
}

export const CheckIfUserExistsInDatabase = async (email: string): Promise<boolean> => {
  try {
    const userCount = await User.countDocuments({ email });
    return userCount > 0;
  }
  catch (err) {
    throw err;
  }
}

export const CreateUser = async (userData: IUserData): Promise<string> => {
  try {
    const user = new User({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      role: userData.role,
      jobDetails: userData.jobDetails,
      socialAccounts: userData.socialAccounts,
    });
    await user.save();
    return user.id;
  }
  catch (err) {
    throw err;
  }
}