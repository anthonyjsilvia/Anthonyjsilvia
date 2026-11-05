import type { Messages } from "@/lib/i18n/en";
import type { PortfolioProject } from "@/lib/portfolio";

type ProjectCopy = Messages["portfolio"]["projects"][keyof Messages["portfolio"]["projects"]];

/** Overlay the active locale onto the structural portfolio records. */
export function localizePortfolio(
  projects: readonly PortfolioProject[],
  copy: Messages["portfolio"]["projects"],
): PortfolioProject[] {
  return projects.map((project) => {
    const text = copy[project.id as keyof typeof copy] as ProjectCopy | undefined;
    if (!text) return project;
    return { ...project, ...text };
  });
}
