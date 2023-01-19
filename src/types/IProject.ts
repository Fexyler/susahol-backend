import { Types } from 'mongoose';


export interface IProject {
  save(): IProject | PromiseLike<IProject>;
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: string;
  tags: string[];
  owner: Types.ObjectId;
  members: string[];
}