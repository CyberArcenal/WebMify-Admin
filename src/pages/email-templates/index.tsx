// src/pages/email-templates/index.tsx
import React, { useState } from "react";
import { Plus, Filter, RefreshCw, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import Pagination from "../../components/Shared/Pagination1";
import { dialogs } from "../../utils/dialogs";
import { showSuccess, showError } from "../../utils/notification";

import useEmailTemplates, { type EmailTemplateWithDetails } from "./hooks/useEmailTemplates";
import EmailTemplateTable from "./components/EmailTemplateTable";
import emailTemplateAPI from "@/api/core/email_template";
import useEmailTemplateForm from "./hooks/useEmailTemplateForm";
import { useEmailTemplateView } from "./hooks/useEmailTemplateView";
import FilterBar from "./components/FilterBar";
import EmailTemplateFormDialog from "./components/EmailTemplateFormDialog";
import EmailTemplateViewDialog from "./components/EmailTemplateViewDialog";

const EmailTemplatesPage: React.FC = () => {
  const {
    templates,
    paginatedTemplates,
    filters,
    loading,
    error,
    pagination,
    selectedTemplates,
    setSelectedTemplates,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleTemplateSelection,
    toggleSelectAll,
    handleSort,
  } = useEmailTemplates();

  const formDialog = useEmailTemplateForm();
  const viewDialog = useEmailTemplateView();

  const [showFilters, setShowFilters] = useState(false);

  const handleDelete = async (template: EmailTemplateWithDetails) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Template",
      message: `Are you sure you want to delete "${template.name}"?`,
    });
    if (!confirmed) return;
    try {
      await emailTemplateAPI.delete(template.id);
      showSuccess("Email template deleted successfully.");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTemplates?.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedTemplates?.length} templates?`,
    });
    if (!confirmed) return;
    try {
      await Promise.all(
        selectedTemplates?.map((id) => emailTemplateAPI.delete(id)),
      );
      showSuccess(`${selectedTemplates?.length} templates deleted.`);
      setSelectedTemplates([]);
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
            Email Templates
          </h2>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage email templates for automated responses
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
            Add Template
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {templates?.length > 0 && (
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
              {templates?.length} Templates
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Total: {pagination.count} templates
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
      {selectedTemplates?.length > 0 && (
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
            {selectedTemplates?.length} template(s) selected
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
          <EmailTemplateTable
            templates={paginatedTemplates}
            selectedTemplates={selectedTemplates}
            onToggleSelect={toggleTemplateSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(template) => viewDialog.open(template.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
          />

          {/* Empty State */}
          {templates?.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Mail
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No email templates found.
              </p>
              <p
                className="mt-xs text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {filters.name
                  ? "Try adjusting your search filters"
                  : "Start by creating your first email template"}
              </p>
              <div className="mt-2 gap-xs flex justify-center">
                {filters.name && (
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
                  Add First Template
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {templates?.length > 0 && pagination.total_pages > 1 && (
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
      <EmailTemplateFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        templateId={formDialog.templateId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />

      <EmailTemplateViewDialog
        isOpen={viewDialog.isOpen}
        template={viewDialog.template}
        loading={viewDialog.loading}
        onClose={viewDialog.close}
        onEdit={(template) => {
          formDialog.openEdit(template);
          viewDialog.close();
        }}
      />
    </div>
  );
};

export default EmailTemplatesPage;