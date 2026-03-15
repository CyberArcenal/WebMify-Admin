// src/pages/skills/index.tsx
import React, { useState } from "react";
import { Plus, Filter, RefreshCw, Code } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import Pagination from "../../components/Shared/Pagination1";
import { dialogs } from "../../utils/dialogs";
import { showSuccess, showError } from "../../utils/notification";

import useSkills, { type SkillWithDetails } from "./hooks/useSkills";
import SkillTable from "./components/SkillTable";
import skillAPI from "@/api/core/skill";
import useSkillForm from "./hooks/useSkillForm";
import { useSkillView } from "./hooks/useSkillView";
import FilterBar from "./components/FilterBar";
import SkillFormDialog from "./components/SkillFormDialog";
import SkillViewDialog from "./components/SkillViewDialog";

const SkillsPage: React.FC = () => {
  const {
    skills,
    paginatedSkills,
    filters,
    loading,
    error,
    pagination,
    selectedSkills,
    setSelectedSkills,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleSkillSelection,
    toggleSelectAll,
    handleSort,
  } = useSkills();

  const formDialog = useSkillForm();
  const viewDialog = useSkillView();

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleFeatured = async (skill: SkillWithDetails) => {
    try {
      await skillAPI.patch(skill.id, { featured: !skill.featured });
      showSuccess(
        skill.featured ? "Removed from featured" : "Marked as featured",
      );
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDelete = async (skill: SkillWithDetails) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Skill",
      message: `Are you sure you want to delete "${skill.name}"?`,
    });
    if (!confirmed) return;
    try {
      await skillAPI.delete(skill.id);
      showSuccess("Skill deleted successfully.");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSkills?.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedSkills?.length} skills?`,
    });
    if (!confirmed) return;
    try {
      await Promise.all(
        selectedSkills?.map((id) => skillAPI.delete(id)),
      );
      showSuccess(`${selectedSkills?.length} skills deleted.`);
      setSelectedSkills([]);
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const getDisplayRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, pagination.count);
    return { start, end };
  };
  const { start, end } = getDisplayRange();

  return (
    <div
      className="compact-card rounded-md shadow-md border"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm mb-4">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--sidebar-text)" }}
          >
            Skills
          </h2>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage your technical and professional skills
          </p>
        </div>
        <div className="flex flex-wrap gap-xs w-full sm:w-auto">
          <button
            className="compact-button rounded-md flex items-center transition-colors ease-in-out hover:scale-105 hover:shadow-md disabled:opacity-50"
            style={{
              backgroundColor: "var(--card-secondary-bg)",
              color: "var(--sidebar-text)",
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="icon-sm mr-xs" />
            Filters {showFilters ? "↑" : "↓"}
          </button>
          <button
            onClick={reload}
            disabled={loading}
            className="btn btn-secondary btn-sm rounded-md flex items-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md disabled:opacity-50"
          >
            <RefreshCw
              className={`icon-sm mr-1 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <Button
            onClick={formDialog.openAdd}
            variant="success"
            size="sm"
            icon={Plus}
            iconPosition="left"
          >
            Add Skill
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {skills?.length > 0 && (
        <div
          className="mb-4 compact-card rounded-md border p-3 flex flex-wrap items-center justify-between gap-2"
          style={{
            backgroundColor: "var(--card-secondary-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-yellow)]"></span>
              {skills?.filter((s) => s.featured).length} Featured
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-gray)]"></span>
              {skills?.filter((s) => !s.featured).length} Not Featured
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Total: {pagination.count} skills
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />
      )}

      {/* Bulk Selection */}
      {selectedSkills?.length > 0 && (
        <div
          className="mb-2 compact-card rounded-md border flex items-center justify-between p-2"
          style={{
            backgroundColor: "var(--accent-blue-dark)",
            borderColor: "var(--accent-blue)",
          }}
        >
          <span
            className="font-medium text-sm"
            style={{ color: "var(--accent-green)" }}
          >
            {selectedSkills?.length} skill(s) selected
          </span>
          <div className="flex gap-xs">
            <button
              className="compact-button bg-[var(--accent-red)] hover:bg-[var(--accent-red-hover)] text-white rounded-md"
              onClick={handleBulkDelete}
              title="Delete selected"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Page Size & Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm mb-2">
        <div className="flex items-center gap-sm">
          <label className="text-sm" style={{ color: "var(--sidebar-text)" }}>
            Show:
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="compact-input border rounded text-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            entries
          </span>
        </div>
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {pagination.count > 0 ? (
            <>
              Showing {start} to {end} of {pagination.count} entries
            </>
          ) : (
            "No entries found"
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-4">
          <div
            className="animate-spin rounded-full h-6 w-6 border-b-2"
            style={{ borderColor: "var(--accent-blue)" }}
          ></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-4 text-red-500">Error: {error}</div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <SkillTable
            skills={paginatedSkills}
            selectedSkills={selectedSkills}
            onToggleSelect={toggleSkillSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(skill) => viewDialog.open(skill.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
          />

          {/* Empty State */}
          {skills?.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Code
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No skills found.
              </p>
              <p
                className="mt-xs text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {Object.values(filters).some((v) => v)
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first skill"}
              </p>
              <div className="mt-2 gap-xs flex justify-center">
                {Object.values(filters).some((v) => v) && (
                  <button
                    className="compact-button rounded-md"
                    style={{
                      backgroundColor: "var(--accent-blue)",
                      color: "white",
                    }}
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </button>
                )}
                <Link
                  to="#"
                  className="compact-button rounded-md inline-block"
                  style={{
                    backgroundColor: "var(--accent-green)",
                    color: "white",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    formDialog.openAdd();
                  }}
                >
                  Add First Skill
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {skills?.length > 0 && pagination.total_pages > 1 && (
            <div className="mt-2">
              <Pagination
                currentPage={currentPage}
                totalItems={pagination.count}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[10, 25, 50, 100]}
                showPageSize={false}
              />
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <SkillFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        skillId={formDialog.skillId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />

      <SkillViewDialog
        isOpen={viewDialog.isOpen}
        skill={viewDialog.skill}
        loading={viewDialog.loading}
        onClose={viewDialog.close}
        onEdit={(skill) => {
          formDialog.openEdit(skill);
          viewDialog.close();
        }}
        onToggleFeatured={handleToggleFeatured}
      />
    </div>
  );
};

export default SkillsPage;