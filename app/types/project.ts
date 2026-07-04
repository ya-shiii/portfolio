export interface WorkflowStep {
  from: string;
  to: string;
  label: string;
}

export interface TechnicalDecision {
  area: string;
  tech: string;
  reason: string;
}

export interface ProjectCaseStudy {
  slug: string;
  projectNumber: string;
  title: string;
  subtitle: string;
  category: string;
  dateRange: string;
  clientType: string;
  featured: boolean;
  summary: string;
  technologies: string[];
  overview: string;
  problem: string;
  role: string;
  solution: string;
  workflow: WorkflowStep[];
  features: string[];
  technicalDecisions: TechnicalDecision[];
  challenges: string;
  outcomes: string;
  githubLink?: string;
  liveLink?: string;
}
