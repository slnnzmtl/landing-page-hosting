import { findProject, projects } from '../data/registry'

export function useProjects() {
  return {
    projects,
    findProject,
  }
}
