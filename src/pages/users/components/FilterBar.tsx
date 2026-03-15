// src/pages/users/components/FilterBar.tsx
import React from "react";
import type { UserFilters } from "../hooks/useUsers";

interface FilterBarProps {
  filters: UserFilters;
  onFilterChange: (key: keyof UserFilters, value: string) => void;
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
          placeholder="Search by username, email, name..."
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

      {/* User Type */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          User Type
        </label>
        <select
          value={filters.user_type}
          onChange={(e) => onFilterChange("user_type", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        >
          <option value="">All</option>
          <option value="viewer">Viewer</option>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="restricted">Restricted</option>
          <option value="suspended">Suspended</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {/* Active */}
      <div>
        <label
          className="block text-sm font-medium mb-xs"
          style={{ color: "var(--sidebar-text)" }}
        >
          Active
        </label>
        <select
          value={filters.is_active}
          onChange={(e) => onFilterChange("is_active", e.target.value)}
          className="compact-input w-full border rounded-md"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
            color: "var(--sidebar-text)",
          }}
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
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