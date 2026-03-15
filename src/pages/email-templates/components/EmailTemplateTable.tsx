// src/pages/email-templates/components/EmailTemplateTable.tsx
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { EmailTemplateWithDetails } from "../hooks/useEmailTemplates";
import { formatDate } from "@/utils/formatters";
import EmailTemplateActionsDropdown from "./EmailTemplateActionsDropdown";

interface EmailTemplateTableProps {
  templates: EmailTemplateWithDetails[];
  selectedTemplates: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (template: EmailTemplateWithDetails) => void;
  onEdit: (template: EmailTemplateWithDetails) => void;
  onDelete: (template: EmailTemplateWithDetails) => void;
}

const EmailTemplateTable: React.FC<EmailTemplateTableProps> = ({
  templates,
  selectedTemplates,
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

  const truncateSubject = (subject: string, maxLength = 50) => {
    if (subject.length <= maxLength) return subject;
    return subject.substring(0, maxLength) + "...";
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
                  templates?.length > 0 &&
                  selectedTemplates?.length === templates?.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("id")}
            >
              <div className="flex items-center gap-xs">
                <span>ID</span>
                {getSortIcon("id")}
              </div>
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
              onClick={() => onSort("subject")}
            >
              <div className="flex items-center gap-xs">
                <span>Subject</span>
                {getSortIcon("subject")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("created_at")}
            >
              <div className="flex items-center gap-xs">
                <span>Created</span>
                {getSortIcon("created_at")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("modified_at")}
            >
              <div className="flex items-center gap-xs">
                <span>Modified</span>
                {getSortIcon("modified_at")}
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
          {templates?.map((template) => (
            <tr
              key={template.id}
              onClick={() => onView(template)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedTemplates?.includes(template.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedTemplates?.includes(template.id)}
                  onChange={() => onToggleSelect(template.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
                {template.id}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {template.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {truncateSubject(template.subject)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(template.created_at)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(template.modified_at)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <EmailTemplateActionsDropdown
                  template={template}
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

export default EmailTemplateTable;