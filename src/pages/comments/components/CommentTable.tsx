// src/pages/comments/components/CommentTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import type { CommentWithDetails } from "../hooks/useComments";
import { formatDate } from "@/utils/formatters";
import CommentActionsDropdown from "./CommentActionsDropdown";

interface CommentTableProps {
  comments: CommentWithDetails[];
  selectedComments: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (comment: CommentWithDetails) => void;
  onEdit: (comment: CommentWithDetails) => void;
  onDelete: (comment: CommentWithDetails) => void;
  onToggleApproved?: (comment: CommentWithDetails) => void;
}

const CommentTable: React.FC<CommentTableProps> = ({
  comments,
  selectedComments,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onToggleApproved,
}) => {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="icon-sm" />
    ) : (
      <ChevronDown className="icon-sm" />
    );
  };

  const getApprovedBadge = (approved: boolean) => {
    return approved
      ? "bg-[var(--accent-green-light)] text-[var(--accent-green)]"
      : "bg-[var(--accent-red-light)] text-[var(--accent-red)]";
  };

  const truncateContent = (content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
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
                  comments?.length > 0 &&
                  selectedComments?.length === comments?.length
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
              onClick={() => onSort("author__name")}
            >
              <div className="flex items-center gap-xs">
                <span>Author</span>
                {getSortIcon("author__name")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("content")}
            >
              <div className="flex items-center gap-xs">
                <span>Content</span>
                {getSortIcon("content")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
            >
              <div className="flex items-center gap-xs">
                <span>Related To</span>
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("approved")}
            >
              <div className="flex items-center gap-xs">
                <span>Status</span>
                {getSortIcon("approved")}
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
              className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {comments?.map((comment) => (
            <tr
              key={comment.id}
              onClick={() => onView(comment)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedComments?.includes(comment.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedComments?.includes(comment.id)}
                  onChange={() => onToggleSelect(comment.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
                {comment.id}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {comment.author?.name || "Anonymous"}
              </td>
              <td className="px-4 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {truncateContent(comment.content)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {comment.content_object ? (
                  <span>
                    {comment.content_object.type} #{comment.content_object.id}
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getApprovedBadge(
                    comment.approved,
                  )}`}
                >
                  {comment.approved ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Pending
                    </>
                  )}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(comment.created_at)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <CommentActionsDropdown
                  comment={comment}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleApproved={onToggleApproved}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentTable;