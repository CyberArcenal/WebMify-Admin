// src/pages/project-gallery/components/ProjectGalleryTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Image } from "lucide-react";
import type { ProjectGalleryImageWithDetails } from "../hooks/useProjectGallery";
import ProjectGalleryActionsDropdown from "./ProjectGalleryActionsDropdown";

interface ProjectGalleryTableProps {
  images: ProjectGalleryImageWithDetails[];
  selectedImages: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (image: ProjectGalleryImageWithDetails) => void;
  onEdit: (image: ProjectGalleryImageWithDetails) => void;
  onDelete: (image: ProjectGalleryImageWithDetails) => void;
}

const ProjectGalleryTable: React.FC<ProjectGalleryTableProps> = ({
  images,
  selectedImages,
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
                  images?.length > 0 &&
                  selectedImages?.length === images?.length
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
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
            >
              <div className="flex items-center gap-xs">
                <span>Image</span>
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
            >
              <div className="flex items-center gap-xs">
                <span>URL</span>
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
          {images?.map((image) => (
            <tr
              key={image.id}
              onClick={() => onView(image)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedImages?.includes(image.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedImages?.includes(image.id)}
                  onChange={() => onToggleSelect(image.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {image.order}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {image.image_url ? (
                  <img
                    src={image.image_url}
                    alt="Gallery"
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <div className="h-10 w-10 bg-[var(--card-secondary-bg)] flex items-center justify-center rounded">
                    <Image className="w-5 h-5 text-[var(--text-secondary)]" />
                  </div>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-[var(--text-secondary)] truncate max-w-xs">
                {image.image_url}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <ProjectGalleryActionsDropdown
                  image={image}
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

export default ProjectGalleryTable;