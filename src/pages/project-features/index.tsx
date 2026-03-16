// src/pages/project-features/index.tsx
import React, { useState, useEffect } from "react";
import { Plus, Filter, RefreshCw, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import Pagination from "../../components/Shared/Pagination1";
import { dialogs } from "../../utils/dialogs";
import { showSuccess, showError } from "../../utils/notification";

import useProjectFeatures, {
  type ProjectFeatureWithDetails,
} from "./hooks/useProjectFeatures";
import ProjectFeatureTable from "./components/ProjectFeatureTable";
import projectFeatureAPI from "@/api/core/project_feature";
import projectAPI, { Project } from "@/api/core/project";
import useProjectFeatureForm from "./hooks/useProjectFeatureForm";
import { useProjectFeatureView } from "./hooks/useProjectFeatureView";
import FilterBar from "./components/FilterBar";
import ProjectFeatureFormDialog from "./components/ProjectFeatureFormDialog";
import ProjectFeatureViewDialog from "./components/ProjectFeatureViewDialog";
import ProjectSelect from "@/components/Selects/Project";

const ProjectFeaturesPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [loadingProjects, setLoadingProjects] = useState(true);

  const {
    features,
    paginatedFeatures,
    filters,
    loading,
    error,
    pagination,
    selectedFeatures,
    setSelectedFeatures,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleFeatureSelection,
    toggleSelectAll,
    handleSort,
  } = useProjectFeatures(selectedProjectId);

  const formDialog = useProjectFeatureForm();
  const viewDialog = useProjectFeatureView();

  const [showFilters, setShowFilters] = useState(false);

  // Load projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await projectAPI.list({ page_size: 100 });
        setProjects(response.results);
        if (response.results.length > 0 && !selectedProjectId) {
          setSelectedProjectId(response.results[0].id);
        }
      } catch (err: any) {
        showError(err.message || "Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (feature: ProjectFeatureWithDetails) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Feature",
      message: `Are you sure you want to delete this feature?`,
    });
    if (!confirmed) return;
    try {
      await projectFeatureAPI.delete(feature.id);
      showSuccess("Feature deleted successfully.");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFeatures?.length === 0 || !selectedProjectId) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedFeatures?.length} features?`,
    });
    if (!confirmed) return;
    try {
      await Promise.all(
        selectedFeatures?.map((id) => projectFeatureAPI.delete(id)),
      );
      showSuccess(`${selectedFeatures?.length} features deleted.`);
      setSelectedFeatures([]);
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
            Project Features
          </h2>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage features for your projects
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
            disabled={!selectedProjectId}
          >
            Add Feature
          </Button>
        </div>
      </div>

      {/* Project Selector */}
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--sidebar-text)" }}
        >
          Select Project
        </label>
        <ProjectSelect
          disabled={loading}
          onChange={(projectId, project) => {
            setSelectedProjectId(projectId);
          }}
          value={selectedProjectId || null}
        />
      </div>

      {/* Summary Banner */}
      {features?.length > 0 && (
        <div
          className="mb-4 compact-card rounded-md border p-3 flex flex-wrap items-center justify-between gap-2"
          style={{
            backgroundColor: "var(--card-secondary-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)]"></span>
              {features?.length} Features
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Total: {pagination.count} features
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
      {selectedFeatures?.length > 0 && (
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
            {selectedFeatures?.length} feature(s) selected
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
          <ProjectFeatureTable
            features={paginatedFeatures}
            selectedFeatures={selectedFeatures}
            onToggleSelect={toggleFeatureSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(feature) => viewDialog.open(feature.id)}
            onEdit={(feature) => {
              formDialog.openEdit(feature);
            }}
            onDelete={handleDelete}
          />

          {/* Empty State */}
          {features?.length === 0 && selectedProjectId && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Layers
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No features found for this project.
              </p>
              <p
                className="mt-xs text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {filters.search
                  ? "Try adjusting your search filters"
                  : "Start by adding your first feature"}
              </p>
              <div className="mt-2 gap-xs flex justify-center">
                {filters.search && (
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
                  Add First Feature
                </Link>
              </div>
            </div>
          )}

          {!selectedProjectId && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Layers
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                Please select a project to view its features.
              </p>
            </div>
          )}

          {/* Pagination */}
          {features?.length > 0 && pagination.total_pages > 1 && (
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
      <ProjectFeatureFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        featureId={formDialog.featureId}
        initialData={formDialog.initialData}
        projectId={selectedProjectId}
        onClose={formDialog.close}
        onSuccess={reload}
      />

      <ProjectFeatureViewDialog
        isOpen={viewDialog.isOpen}
        feature={viewDialog.feature}
        loading={viewDialog.loading}
        onClose={viewDialog.close}
        onEdit={(feature) => {
          formDialog.openEdit(feature);
          viewDialog.close();
        }}
      />
    </div>
  );
};

export default ProjectFeaturesPage;
