// src/pages/testimonials/components/TestimonialTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Star, CheckCircle, XCircle } from "lucide-react";
import type { TestimonialWithDetails } from "../hooks/useTestimonials";
import { formatDate } from "@/utils/formatters";
import TestimonialActionsDropdown from "./TestimonialActionsDropdown";

interface TestimonialTableProps {
  testimonials: TestimonialWithDetails[];
  selectedTestimonials: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (testimonial: TestimonialWithDetails) => void;
  onEdit: (testimonial: TestimonialWithDetails) => void;
  onDelete: (testimonial: TestimonialWithDetails) => void;
  onToggleFeatured?: (testimonial: TestimonialWithDetails) => void;
  onToggleApproved?: (testimonial: TestimonialWithDetails) => void;
}

const TestimonialTable: React.FC<TestimonialTableProps> = ({
  testimonials,
  selectedTestimonials,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
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

  const getFeaturedBadge = (featured: boolean) => {
    return featured
      ? "bg-[var(--accent-yellow-light)] text-[var(--accent-yellow)]"
      : "bg-[var(--accent-gray-light)] text-[var(--text-secondary)]";
  };

  const getApprovedBadge = (approved: boolean) => {
    return approved
      ? "bg-[var(--accent-green-light)] text-[var(--accent-green)]"
      : "bg-[var(--accent-red-light)] text-[var(--accent-red)]";
  };

  const truncateContent = (content: string, maxLength = 60) => {
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
                  testimonials?.length > 0 &&
                  selectedTestimonials?.length === testimonials?.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("author")}
            >
              <div className="flex items-center gap-xs">
                <span>Author</span>
                {getSortIcon("author")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("author_title")}
            >
              <div className="flex items-center gap-xs">
                <span>Title</span>
                {getSortIcon("author_title")}
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
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("rating")}
            >
              <div className="flex items-center gap-xs">
                <span>Rating</span>
                {getSortIcon("rating")}
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
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("approved")}
            >
              <div className="flex items-center gap-xs">
                <span>Approved</span>
                {getSortIcon("approved")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("created_at")}
            >
              <div className="flex items-center gap-xs">
                <span>Date</span>
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
          {testimonials?.map((testimonial) => (
            <tr
              key={testimonial.id}
              onClick={() => onView(testimonial)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedTestimonials?.includes(testimonial.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedTestimonials?.includes(testimonial.id)}
                  onChange={() => onToggleSelect(testimonial.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {testimonial.author}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {testimonial.author_title}
              </td>
              <td className="px-4 py-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {truncateContent(testimonial.content)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {testimonial.rating} / 5
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getFeaturedBadge(
                    testimonial.featured,
                  )}`}
                >
                  {testimonial.featured ? (
                    <>
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </>
                  ) : (
                    "Not Featured"
                  )}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getApprovedBadge(
                    testimonial.approved,
                  )}`}
                >
                  {testimonial.approved ? (
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
                {formatDate(testimonial.created_at)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <TestimonialActionsDropdown
                  testimonial={testimonial}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFeatured={onToggleFeatured}
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

export default TestimonialTable;