// src/pages/skills/components/SkillTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Star } from "lucide-react";
import type { SkillWithDetails } from "../hooks/useSkills";
import SkillActionsDropdown from "./SkillActionsDropdown";

interface SkillTableProps {
  skills: SkillWithDetails[];
  selectedSkills: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (skill: SkillWithDetails) => void;
  onEdit: (skill: SkillWithDetails) => void;
  onDelete: (skill: SkillWithDetails) => void;
  onToggleFeatured?: (skill: SkillWithDetails) => void;
}

const SkillTable: React.FC<SkillTableProps> = ({
  skills,
  selectedSkills,
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

  const getFeaturedBadge = (featured: boolean) => {
    return featured
      ? "bg-[var(--accent-yellow-light)] text-[var(--accent-yellow)]"
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
                  skills?.length > 0 &&
                  selectedSkills?.length === skills?.length
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
              onClick={() => onSort("proficiency")}
            >
              <div className="flex items-center gap-xs">
                <span>Proficiency</span>
                {getSortIcon("proficiency")}
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
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("featured")}
            >
              <div className="flex items-center gap-xs">
                <span>Featured</span>
                {getSortIcon("featured")}
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
          {skills?.map((skill) => (
            <tr
              key={skill.id}
              onClick={() => onView(skill)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedSkills?.includes(skill.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedSkills?.includes(skill.id)}
                  onChange={() => onToggleSelect(skill.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {skill.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {skill.category_display || skill.category}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                <div className="flex items-center gap-1">
                  <span>{skill.proficiency}%</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full bg-[var(--accent-blue)]"
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {skill.order}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getFeaturedBadge(skill.featured)}`}
                >
                  {skill.featured ? (
                    <>
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </>
                  ) : (
                    "Not Featured"
                  )}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <SkillActionsDropdown
                  skill={skill}
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

export default SkillTable;