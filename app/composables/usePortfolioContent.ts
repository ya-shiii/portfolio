import type { PortfolioData } from '~/types/portfolio'
import type { ProjectCaseStudy } from '~/types/project'

import portfolioData from '~/content/portfolio.json'
import aptitudeData from '~/content/projects/aptitude.json'
import kathiesKitchenData from '~/content/projects/kathies-kitchen.json'
import delgarData from '~/content/projects/delgar.json'
import techsavvyData from '~/content/projects/techsavvy.json'

export const usePortfolioContent = () => {
  const getPortfolio = (): PortfolioData => {
    return portfolioData as PortfolioData
  }

  const getProjects = (): ProjectCaseStudy[] => {
    return [
      aptitudeData,
      kathiesKitchenData,
      delgarData,
      techsavvyData
    ] as ProjectCaseStudy[]
  }

  const getProjectBySlug = (slug: string): ProjectCaseStudy | undefined => {
    const projects = getProjects()
    return projects.find(p => p.slug === slug)
  }

  return {
    getPortfolio,
    getProjects,
    getProjectBySlug
  }
}
