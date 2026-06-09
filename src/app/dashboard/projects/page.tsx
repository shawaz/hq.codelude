import { getAllProjects } from '@/lib/site-projects';
import ProjectsContent from './projects-content';

export default function ProjectsPage() {
  const siteProjects = getAllProjects();
  return <ProjectsContent siteProjects={siteProjects} />;
}
