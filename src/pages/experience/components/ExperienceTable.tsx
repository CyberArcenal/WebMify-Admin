// src/pages/experience/components/ExperienceTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Briefcase } from "lucide-react";
import type { ExperienceWithDetails } from "../hooks/useExperience";
import { formatDate } from "@/utils/formatters";
import ExperienceActionsDropdown from "./ExperienceActionsDropdown";

interface ExperienceTableProps {
  experiences: ExperienceWithDetails[];
  selectedExperiences: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (experience: ExperienceWithDetails) => void;
  onEdit: (experience: ExperienceWithDetails) => void;
  onDelete: (experience: ExperienceWithDetails) => void;
}

const ExperienceTable: React.FC<ExperienceTableProps> = ({
  experiences,
  selectedExperiences,
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

  const getCurrentBadge = (current: boolean) => {
    return current
      ? "bg-[var(--accent-green-light)] text-[var(--accent-green)]"
      : "bg-[var(--accent-gray-light)] text-[var(--text-secondary)]";
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
                  experiences?.length > 0 &&
                  selectedExperiences?.length === experiences?.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("company")}
            >
              <div className="flex items-center gap-xs">
                <span>Company</span>
                {getSortIcon("company")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("position")}
            >
              <div className="flex items-center gap-xs">
                <span>Position</span>
                {getSortIcon("position")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("start_date")}
            >
              <div className="flex items-center gap-xs">
                <span>Start Date</span>
                {getSortIcon("start_date")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("end_date")}
            >
              <div className="flex items-center gap-xs">
                <span>End Date</span>
                {getSortIcon("end_date")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("current")}
            >
              <div className="flex items-center gap-xs">
                <span>Current</span>
                {getSortIcon("current")}
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
              className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {experiences?.map((item) => (
            <tr
              key={item.id}
              onClick={() => onView(item)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedExperiences?.includes(item.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedExperiences?.includes(item.id)}
                  onChange={() => onToggleSelect(item.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {item.company}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.position}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(item.start_date)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.current ? "Present" : (item.end_date ? formatDate(item.end_date) : "-")}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getCurrentBadge(
                    item.current,
                  )}`}
                >
                  {item.current ? "Current" : "Past"}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.order}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <ExperienceActionsDropdown
                  experience={item}
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

export default ExperienceTable;