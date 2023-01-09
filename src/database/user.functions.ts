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
  fullName: string;
  password: string; //NOTE: Hashed password
  role: string;
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
      fullName: userData.fullName,
      password: userData.password,
      role: userData.role,
    });
    await user.save();
    return user.id;
  }
  catch (err) {
    throw err;
  }
}

export const GetUser = async (userId: string | null) => {
  try {
    if (!userId) {
      return null;
    }
    const user = await User.findById(userId).lean();
    if (!user) {
      return null;
    }
    return user;
  }
  catch (err) {
    throw err;
  }
}

export const GetUserByEmail = async (email: string | null) => {
  try {
    const user = await User.findOne({email}).lean();
    if (!user) {
      return null;
    }
    return user;
  }
  catch (err) {
    throw err;
  }
}