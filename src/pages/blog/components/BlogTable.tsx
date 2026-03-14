// src/pages/blog/components/BlogTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Star } from "lucide-react";
import type { BlogWithDetails } from "../hooks/useBlogs";
import BlogActionsDropdown from "./BlogActionsDropdown";
import { formatDate } from "../../../utils/formatters";

interface BlogTableProps {
  blogs: BlogWithDetails[];
  selectedBlogs: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (blog: BlogWithDetails) => void;
  onEdit: (blog: BlogWithDetails) => void;
  onDelete: (blog: BlogWithDetails) => void;
  onToggleFeatured?: (blog: BlogWithDetails) => void;
}

const BlogTable: React.FC<BlogTableProps> = ({
  blogs,
  selectedBlogs,
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

  const getStatusBadge = (status: string) => {
    return status === "published"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
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
                  blogs?.length > 0 && selectedBlogs?.length === blogs?.length
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
                onSort("slug");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Slug</span>
                {getSortIcon("slug")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSort("author__name");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Author</span>
                {getSortIcon("author__name")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSort("status");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Status</span>
                {getSortIcon("status")}
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
                onSort("published_date");
              }}
            >
              <div className="flex items-center gap-xs">
                <span>Published</span>
                {getSortIcon("published_date")}
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
          {blogs?.map((blog) => (
            <tr
              key={blog.id}
              onClick={(e) => {
                e.stopPropagation();
                onView(blog);
              }}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors ${
                selectedBlogs?.includes(blog.id)
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
                  checked={selectedBlogs?.includes(blog.id)}
                  onChange={() => onToggleSelect(blog.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td
                className="px-4 py-2 whitespace-nowrap text-sm font-medium"
                style={{ color: "var(--sidebar-text)" }}
              >
                {blog.title}
              </td>
              <td
                className="px-4 py-2 whitespace-nowrap text-sm font-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                {blog.slug}
              </td>
              <td
                className="px-4 py-2 whitespace-nowrap text-sm"
                style={{ color: "var(--sidebar-text)" }}
              >
                {blog.author?.name || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getStatusBadge(blog.status)}`}
                >
                  {blog.status_display}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {blog.featured ? (
                  <Star className="w-4 h-4 text-yellow-500" />
                ) : (
                  <span className="text-[var(--text-secondary)]">—</span>
                )}
              </td>
              <td
                className="px-4 py-2 whitespace-nowrap text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {blog.published_date ? formatDate(blog.published_date) : "-"}
              </td>
              <td
                className="px-4 py-2 whitespace-nowrap text-sm text-right"
                style={{ color: "var(--text-secondary)" }}
              >
                {blog.views.toLocaleString()}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <BlogActionsDropdown
                  blog={blog}
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

export default BlogTable;
