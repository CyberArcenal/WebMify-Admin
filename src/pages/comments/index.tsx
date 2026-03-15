// src/pages/comments/index.tsx
import React, { useState } from "react";
import { Plus, Filter, RefreshCw, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import Pagination from "../../components/Shared/Pagination1";
import { dialogs } from "../../utils/dialogs";
import { showSuccess, showError } from "../../utils/notification";

import useComments, { type CommentWithDetails } from "./hooks/useComments";
import commentAPI from "@/api/core/comment";
import useCommentForm from "./hooks/useCommentForm";
import { useCommentView } from "./hooks/useCommentView";
import FilterBar from "./components/FilterBar";
import CommentTable from "./components/CommentTable";
import CommentFormDialog from "./components/CommentFormDialog";
import CommentViewDialog from "./components/CommentViewDialog";

const CommentsPage: React.FC = () => {
  const {
    comments,
    paginatedComments,
    filters,
    loading,
    error,
    pagination,
    selectedComments,
    setSelectedComments,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleCommentSelection,
    toggleSelectAll,
    handleSort,
  } = useComments();

  const formDialog = useCommentForm();
  const viewDialog = useCommentView();

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleApproved = async (comment: CommentWithDetails) => {
    try {
      await commentAPI.patch(comment.id, { approved: !comment.approved });
      showSuccess(
        comment.approved ? "Comment unapproved" : "Comment approved",
      );
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDelete = async (comment: CommentWithDetails) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Comment",
      message: `Are you sure you want to delete this comment?`,
    });
    if (!confirmed) return;
    try {
      await commentAPI.delete(comment.id);
      showSuccess("Comment deleted successfully.");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedComments?.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedComments?.length} comments?`,
    });
    if (!confirmed) return;
    try {
      await Promise.all(
        selectedComments?.map((id) => commentAPI.delete(id)),
      );
      showSuccess(`${selectedComments?.length} comments deleted.`);
      setSelectedComments([]);
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
            Comments
          </h2>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage user comments on blogs and projects
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
            Add Comment
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {comments?.length > 0 && (
        <div
          className="mb-4 compact-card rounded-md border p-3 flex flex-wrap items-center justify-between gap-2"
          style={{
            backgroundColor: "var(--card-secondary-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]"></span>
              {comments?.filter((c) => c.approved).length} Approved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-red)]"></span>
              {comments?.filter((c) => !c.approved).length} Pending
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Total: {pagination.count} comments
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
      {selectedComments?.length > 0 && (
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
            {selectedComments?.length} comment(s) selected
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
          <CommentTable
            comments={paginatedComments}
            selectedComments={selectedComments}
            onToggleSelect={toggleCommentSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(comment) => viewDialog.open(comment.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
            onToggleApproved={handleToggleApproved}
          />

          {/* Empty State */}
          {comments?.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <MessageSquare
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No comments found.
              </p>
              <p
                className="mt-xs text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {Object.values(filters).some((v) => v)
                  ? "Try adjusting your search or filters"
                  : "Start by creating your first comment"}
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
                  Add First Comment
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {comments?.length > 0 && pagination.total_pages > 1 && (
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
      <CommentFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        commentId={formDialog.commentId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />

      <CommentViewDialog
        isOpen={viewDialog.isOpen}
        comment={viewDialog.comment}
        loading={viewDialog.loading}
        replies={viewDialog.replies}
        loadingReplies={viewDialog.loadingReplies}
        onClose={viewDialog.close}
        onEdit={(comment) => {
          formDialog.openEdit(comment);
          viewDialog.close();
        }}
        onFetchReplies={viewDialog.fetchReplies}
        onToggleApproved={handleToggleApproved}
      />
    </div>
  );
};

export default CommentsPage;