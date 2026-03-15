// src/pages/comments/components/FilterBar.tsx
import React from "react";
import type { CommentFilters } from "../hooks/useComments";

interface FilterBarProps {
  filters: CommentFilters;
  onFilterChange: (key: keyof CommentFilters, value: string) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-sm mb-4 compact-card rounded-md border p-3"
      style={{
        backgroundColor: "var(--card-secondary-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Search */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Search
        </label>
        <input
          type="text"
          placeholder="Search by content..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        />
      </div>

      {/* Approved */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Status
        </label>
        <select
          value={filters.approved}
          onChange={(e) => onFilterChange("approved", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        >
          <option value="">All</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>
      </div>

      {/* Content Type */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Content Type
        </label>
        <select
          value={filters.content_type}
          onChange={(e) => onFilterChange("content_type", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        >
          <option value="">All</option>
          <option value="blog">Blog</option>
          <option value="project">Project</option>
        </select>
      </div>

      {/* Object ID */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Object ID
        </label>
        <input
          type="number"
          placeholder="e.g., 123"
          value={filters.object_id}
          onChange={(e) => onFilterChange("object_id", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        />
      </div>

      {/* Reset button */}
      <div className="flex items-end col-span-full">
        <button
          onClick={onReset}
          className="compact-button w-full rounded-md transition-colors"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "var(--sidebar-text)",
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;