// src/pages/skills/components/FilterBar.tsx
import React from "react";
import type { SkillFilters } from "../hooks/useSkills";

interface FilterBarProps {
  filters: SkillFilters;
  onFilterChange: (key: keyof SkillFilters, value: string) => void;
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
          placeholder="Search by name..."
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

      {/* Category */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Category
        </label>
        <input
          type="text"
          placeholder="Filter by category"
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        />
      </div>

      {/* Featured */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Featured
        </label>
        <select
          value={filters.featured}
          onChange={(e) => onFilterChange("featured", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        >
          <option value="">All</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>
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