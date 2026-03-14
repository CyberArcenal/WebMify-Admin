// src/pages/projects/components/ProjectTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Star, Globe, Github } from "lucide-react";
import type { ProjectWithDetails } from "../hooks/useProjects";
import ProjectActionsDropdown from "./ProjectActionsDropdown";
import { formatDate } from "../../../utils/formatters";

interface ProjectTableProps {
  projects: ProjectWithDetails[];
  selectedProjects: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (project: ProjectWithDetails) => void;
  onEdit: (project: ProjectWithDetails) => void;
  onDelete: (project: ProjectWithDetails) => void;
  onToggleFeatured?: (project: ProjectWithDetails) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  selectedProjects,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="icon-sm" />
    ) : (
      <ChevronDown className="icon-sm" />
    );
  };

  const getProjectTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      web: "bg-blue-100 text-blue-700",
      mobile: "bg-green-100 text-green-700",
      design: "bg-purple-100 text-purple-700",
      other: "bg-gray-100 text-gray-700",
    };
    const display: Record<string, string> = {
      web: "Web",
      mobile: "Mobile",
      design: "Design",
      other: "Other",
    };
    return (
      <span className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${colors[type] || colors.other}`}>
        {display[type] || type}
      </span>
    );
  };

  return (
    <div
      className="overflow-x-auto rounded-md border compact-table"
      style={{ borderColor: "var(--border-color)" }}
    >
      <table
        className="min-w-full"
        style={{ borderColor: "var(--border-color)" }}
      >
        <thead style={{ backgroundColor: "var(--card-secondary-bg)" }}>
          <tr>
            <th
              scope="col"
              className="w-10 px-2 py-2 text-left text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              <input
                type="checkbox"
                checked={
                  projects.length > 0 &&
                  selectedProjects.length === projects.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSort("title");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Title</span>
                {getSortIcon("title")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSort("project_type");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Type</span>
                {getSortIcon("project_type")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSort("featured");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Featured</span>
                {getSortIcon("featured")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSort("created_at");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Created</span>
                {getSortIcon("created_at")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSort("views");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Views</span>
                {getSortIcon("views")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {projects.map((project) => (
            <tr
              key={project.id}
              onClick={(e) => {
                e.stopPropagation();
                onView(project);
              }}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors ${
                selectedProjects.includes(project.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  checked={selectedProjects.includes(project.id)}
                  onChange={() => onToggleSelect(project.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td
                className="px-4 py-2 whitespace-nowrap text-sm font-medium"
                style={{ color: "var(--sidebar-text)" }}
              >
                {project.title}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {getProjectTypeBadge(project.project_type)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {project.featured ? (
                  <Star className="w-4 h-4 text-yellow-500" />
                ) : (
                  <span className="text-[var(--text-secondary)]">—</span>
                )}
              </td>
              <td
                className="px-4 py-2 whitespace-nowrap text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {formatDate(project.created_at)}
              </td>
              <td
                className="px-4 py-2 whitespace-nowrap text-sm text-right"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.views.toLocaleString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <ProjectActionsDropdown
                  project={project}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFeatured={onToggleFeatured}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;