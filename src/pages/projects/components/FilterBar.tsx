// src/pages/projects/components/FilterBar.tsx
import React, { useEffect, useState } from "react";
import type { ProjectFilters } from "../hooks/useProjects";
import categoryAPI, { Category } from "@/api/core/category";
import CategorySelect from "@/components/Selects/Category";

interface FilterBarProps {
  filters: ProjectFilters;
  onFilterChange: (key: keyof ProjectFilters, value: any) => void;
  onReset: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.list();
        setCategories(response.results);
      } catch (error) {}
    };
    loadCategories();
  }, [onReset]);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-sm mb-4 compact-card rounded-md border p-3"
      style={{
        backgroundColor: "var(--card-secondary-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Search
        </label>
        <input
          type="text"
          placeholder="Search by title..."
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

      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Project Type
        </label>
        <CategorySelect
          value={filters.project_type}
          onChange={(
            categoryId: number | null,
            category?: Category,
          ) => {
            if (categoryId !== null) {
     onFilterChange("project_type", categoryId)
            }
      
          }}
        />
      </div>

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
