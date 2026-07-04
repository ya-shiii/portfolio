export interface Identity {
  initials: string;
  fullName: string;
  title: string;
  brandStatement: string;
  location: string;
  shortBio: string;
}

export interface HeroData {
  eyebrow: string;
  headlineLines: string[];
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface NavNode {
  id: string;
  label: string;
  number: string;
}

export interface WhatIBuildCategory {
  title: string;
  description: string;
  details: string[];
}

export interface ExperienceEntry {
  period: string;
  role: string;
  organization: string;
  location: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface SpeakingEngagement {
  event: string;
  organization: string;
  date: string;
  location: string;
  role: string;
  topic: string;
  description: string;
  hasCertificate: boolean;
}

export interface TechnologyItem {
  name: string;
  level: string; // e.g., "Core", "Expert", "Proficient"
}

export interface TechGroup {
  category: string;
  items: string[];
}

export interface SocialLinks {
  email: string;
  linkedin: string;
  github: string;
  resume: string;
}

export interface PortfolioData {
  identity: Identity;
  hero: HeroData;
  navigation: NavNode[];
  whatIBuild: WhatIBuildCategory[];
  about: string;
  experience: ExperienceEntry[];
  speaking: SpeakingEngagement[];
  stack: TechGroup[];
  socialLinks: SocialLinks;
}
