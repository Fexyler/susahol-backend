/* eslint-disable func-names */
import mongoose, { Schema } from 'mongoose';
import { IUser } from '../../types/IUser';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    lowercase: true,
    index: true,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'manager'],
    default: 'user',
  },
  jobDetails: {
    type: {
      jobName: {
        type: String,
        enum: ['student', 'academician', 'employee'],
        default: 'student',
      },
      companyInfo: {
        companyName: String,
        department: String,
        title: String,
        expertise: String
      }
    }
  },
  socialAccounts: {
    type: {
      twitter: String,
      facebook: String,
      linkedin: String,
      googleScholar: String
    }
  }
});

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
