// src/pages/project-techstacks/components/ProjectTechStackTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Cpu } from "lucide-react";
import type { ProjectTechStackWithDetails } from "../hooks/useProjectTechStacks";
import ProjectTechStackActionsDropdown from "./ProjectTechStackActionsDropdown";

interface ProjectTechStackTableProps {
  items: ProjectTechStackWithDetails[];
  selectedItems: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (item: ProjectTechStackWithDetails) => void;
  onEdit: (item: ProjectTechStackWithDetails) => void;
  onDelete: (item: ProjectTechStackWithDetails) => void;
}

const ProjectTechStackTable: React.FC<ProjectTechStackTableProps> = ({
  items,
  selectedItems,
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
                  items?.length > 0 &&
                  selectedItems?.length === items?.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-xs">
                <span>Name</span>
                {getSortIcon("name")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("category")}
            >
              <div className="flex items-center gap-xs">
                <span>Category</span>
                {getSortIcon("category")}
              </div>
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
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
            >
              <div className="flex items-center gap-xs">
                <span>Icon</span>
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
          {items?.map((item) => (
            <tr
              key={item.id}
              onClick={() => onView(item)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedItems?.includes(item.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedItems?.includes(item.id)}
                  onChange={() => onToggleSelect(item.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {item.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.category}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.order}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.icon ? (
                  <span className="font-mono text-xs">{item.icon}</span>
                ) : (
                  <Cpu className="w-4 h-4" />
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <ProjectTechStackActionsDropdown
                  item={item}
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

export default ProjectTechStackTable;