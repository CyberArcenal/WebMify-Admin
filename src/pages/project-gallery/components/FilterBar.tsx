// src/pages/project-gallery/components/FilterBar.tsx
import React from "react";
import type { ProjectGalleryFilters } from "../hooks/useProjectGallery";

interface FilterBarProps {
  filters: ProjectGalleryFilters;
  onFilterChange: (key: keyof ProjectGalleryFilters, value: string) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-sm mb-4 compact-card rounded-md border p-3"
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
          Search (by URL)
        </label>
        <input
          type="text"
          placeholder="Search..."
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

      {/* Reset button */}
      <div className="flex items-end">
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