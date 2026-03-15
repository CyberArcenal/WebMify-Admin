// src/pages/project-features/components/ProjectFeatureTable.tsx
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { ProjectFeatureWithDetails } from "../hooks/useProjectFeatures";
import ProjectFeatureActionsDropdown from "./ProjectFeatureActionsDropdown";

interface ProjectFeatureTableProps {
  features: ProjectFeatureWithDetails[];
  selectedFeatures: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (feature: ProjectFeatureWithDetails) => void;
  onEdit: (feature: ProjectFeatureWithDetails) => void;
  onDelete: (feature: ProjectFeatureWithDetails) => void;
}

const ProjectFeatureTable: React.FC<ProjectFeatureTableProps> = ({
  features,
  selectedFeatures,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
}) => {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="icon-sm" />
    ) : (
      <ChevronDown className="icon-sm" />
    );
  };

  const truncateDescription = (desc: string, maxLength = 60) => {
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength) + "...";
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
                  features?.length > 0 &&
                  selectedFeatures?.length === features?.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("order")}
            >
              <div className="flex items-center gap-xs">
                <span>Order</span>
                {getSortIcon("order")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("description")}
            >
              <div className="flex items-center gap-xs">
                <span>Description</span>
                {getSortIcon("description")}
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
          {features?.map((feature) => (
            <tr
              key={feature.id}
              onClick={() => onView(feature)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedFeatures?.includes(feature.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedFeatures?.includes(feature.id)}
                  onChange={() => onToggleSelect(feature.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {feature.order}
              </td>
              <td className="px-4 py-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
                {truncateDescription(feature.description)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <ProjectFeatureActionsDropdown
                  feature={feature}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectFeatureTable;