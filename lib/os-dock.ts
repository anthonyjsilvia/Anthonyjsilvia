export type DockEdge = "bottom" | "top" | "left" | "right";

export const DOCK_EDGES: DockEdge[] = ["bottom", "top", "left", "right"];

export function isDockEdge(value: string | null): value is DockEdge {
  return value === "bottom" || value === "top" || value === "left" || value === "right";
}
