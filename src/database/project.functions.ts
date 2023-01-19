import { Types } from 'mongoose';
import { Project, User } from './index';
import { GetUser } from './user.functions';

export interface IProjectData {
  title: string;
  description: string;
  tags: string[];
  owner: Types.ObjectId;
  members: string[];
}

export const CreateProject = async (projectData: IProjectData): Promise<string> => {
  try {
    const project = new Project({
      title: projectData.title,
      description: projectData.description,
      image: "https://i.picsum.photos/id/635/200/200.jpg?hmac=Vm8Tavc31Qax01634w3MOPpNCCfasJG8wnBamSi87T4",
      tags: projectData.tags,
      owner: projectData.owner,
      members: projectData.members,
    });
    await project.save();
    return project.id;
  }
  catch (err) {
    throw err;
  }
}

export const EditProject = async (projectId: string, projectData: IProjectData): Promise<boolean> => {
  try {
    await Project.findByIdAndUpdate(projectId, {
      title: projectData.title,
      description: projectData.description,
      tags: projectData.tags,
      owner: projectData.owner,
      members: projectData.members,
    });
    return true;
  }
  catch (err) {
    throw err;
  }
}

export const GetProjectDetails = async (projectId: string) => {
  try {
    const projectDetails = await Project.findById(projectId);
    if (!projectDetails) {
      return null;
    }
    const userData = await GetUser(projectDetails.owner.toString());
    return {
      id: projectDetails._id.toString(),
      title: projectDetails.title,
      description: projectDetails.description,
      image: projectDetails.image,
      tags: projectDetails.tags,
      members: projectDetails.members,
      owner: {
        username: userData?.username,
        firstName: userData?.firstName,
        lastName: userData?.email,
        email: userData?.email,
        about: userData?.about,
        image: userData?.image,
      },
    }
  }
  catch (err) {
    throw err
  }
}

export const GetProjectDetailsOfUser = async (userId: string) => {
  try {
    const projects = await Project.find({owner: userId});
    if (!projects || projects.length === 0) {
      return []
    };
    const parsedProjects = projects.map((project) => ({
      id: project._id.toString(),
      title: project.title,
      tags: project.tags,
      image: project.image
    }))
    return parsedProjects;
  }
  catch (err) {
    throw err;
  }
}

export const GetProjects = async (search: string | null) => {
  try {
    if (!search) {
      const allProjects = await Project.find();
      const parsedProjects = await Promise.all(allProjects.map(async (project) => {
        const user = await GetUser(project.owner.toString());
        return {
          id: project._id.toString(),
          title: project.title,
          description: project.description,
          tags: project.tags,
          owner: {
            username: user?.username,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            image: user?.image,
          }
        }
      }));
      return parsedProjects;
    }
    const allProjects = await Project.find({
      $or: [{
        title: {$regex: search}
      }, {
        tags: search
      }]
    });
    const parsedProjects = await Promise.all(allProjects.map(async (project) => {
      const user = await GetUser(project.owner.toString());
      return {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        tags: project.tags,
        owner: {
          username: user?.username,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          image: user?.image,
        }
      }
    }));
    return parsedProjects;
  }
  catch (err) {
    throw err;
  }
}