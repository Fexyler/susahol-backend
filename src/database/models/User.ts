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
  username: {
    type: String,
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
    default: 'user',
  },
  company: {
    type: String,
    default: 'Sabanci University'
  },
  department: {
    type: String,
    default: "Faculty of Engineering and Science"
  },
  about: {
    type: String,
    default: "Researcher"
  },
  image: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
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
