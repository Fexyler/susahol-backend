/* eslint-disable func-names */
import mongoose, { Schema } from 'mongoose';
import { IProject } from '../../types/IProject';

const projectSchema = new Schema<IProject>({
  title: String,
  description: String,
  image: {
    type: String,
    default: "https://i.picsum.photos/id/635/200/200.jpg?hmac=Vm8Tavc31Qax01634w3MOPpNCCfasJG8wnBamSi87T4"
  },
  tags: {
    type: [String],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  members: {
    type: [String]
  }
});

const Project = mongoose.model('projects', projectSchema);

export default Project;
