import { Request, Response, NextFunction } from "express";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";



export const getAllProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (err) {
    next(err); 
  }
};


export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};


export const addProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newProject = await createProject(req.body);
    res.status(201).json(newProject);
  } catch (err) {
    next(err);
  }
};


export const updateProjectDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedProject = await updateProject(req.params.slug, req.body);
    if (!updatedProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(updatedProject);
  } catch (err) {
    next(err);
  }
};




export const removeProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!slug) {
      res.status(400).json({ message: "Slug is required" });
      return;
    }

    const deletedProject = await deleteProject(slug);

    if (!deletedProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};

