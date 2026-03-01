import type { Project } from "../models/project.js";

const projects = new Map<string, Project>();
let counter = 1;

function nextId() {
    return `p_${counter++}`;
}

export const projectRepo = {
    create(data: Omit<Project, "id">): Project {
        const project: Project = { id: nextId(), ...data };
        projects.set(project.id, project);
        return project;
    },

    findById(id: string): Project | undefined {
        return projects.get(id);
    },

    update(project: Project): Project {
        projects.set(project.id, project);
        return project;
    },

    list(): Project[] {
        return Array.from(projects.values());
    }
};