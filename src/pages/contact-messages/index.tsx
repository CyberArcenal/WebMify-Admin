// src/pages/contact-messages/index.tsx
import React, { useState } from "react";
import { Filter, RefreshCw, Mail, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import Pagination from "../../components/Shared/Pagination1";
import { dialogs } from "../../utils/dialogs";
import { showSuccess, showError } from "../../utils/notification";

import useContactMessages, { type ContactMessageWithDetails } from "./hooks/useContactMessages";
import ContactMessageTable from "./components/ContactMessageTable";
import contactMessageAPI from "@/api/core/contact_message";
import { useContactMessageView } from "./hooks/useContactMessageView";
import FilterBar from "./components/FilterBar";
import ContactMessageViewDialog from "./components/ContactMessageViewDialog";

const ContactMessagesPage: React.FC = () => {
  const {
    messages,
    paginatedMessages,
    filters,
    loading,
    error,
    pagination,
    selectedMessages,
    setSelectedMessages,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleMessageSelection,
    toggleSelectAll,
    handleSort,
  } = useContactMessages();

  const viewDialog = useContactMessageView();

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleRead = async (message: ContactMessageWithDetails) => {
    try {
      await contactMessageAPI.patch(message.id, { is_read: !message.is_read });
      showSuccess(
        message.is_read ? "Message marked as unread" : "Message marked as read",
      );
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDelete = async (message: ContactMessageWithDetails) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Message",
      message: `Are you sure you want to delete this message from "${message.name}"?`,
    });
    if (!confirmed) return;
    try {
      await contactMessageAPI.delete(message.id);
      showSuccess("Message deleted successfully.");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages?.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedMessages?.length} messages?`,
    });
    if (!confirmed) return;
    try {
      await Promise.all(
        selectedMessages?.map((id) => contactMessageAPI.delete(id)),
      );
      showSuccess(`${selectedMessages?.length} messages deleted.`);
      setSelectedMessages([]);
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
            Contact Messages
          </h2>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage messages received from the contact form
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
        </div>
      </div>

      {/* Summary Banner */}
      {messages?.length > 0 && (
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
              {messages?.filter((m) => m.is_read).length} Read
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-red)]"></span>
              {messages?.filter((m) => !m.is_read).length} Unread
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Total: {pagination.count} messages
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
      {selectedMessages?.length > 0 && (
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
            {selectedMessages?.length} message(s) selected
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
          <ContactMessageTable
            messages={paginatedMessages}
            selectedMessages={selectedMessages}
            onToggleSelect={toggleMessageSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(message) => viewDialog.open(message.id)}
            onDelete={handleDelete}
            onToggleRead={handleToggleRead}
          />

          {/* Empty State */}
          {messages?.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Mail
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No messages found.
              </p>
              <p
                className="mt-xs text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {filters.is_read !== ""
                  ? "Try adjusting your filters"
                  : "Messages from the contact form will appear here"}
              </p>
              <div className="mt-2 gap-xs flex justify-center">
                {filters.is_read !== "" && (
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
              </div>
            </div>
          )}

          {/* Pagination */}
          {messages?.length > 0 && pagination.total_pages > 1 && (
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
      <ContactMessageViewDialog
        isOpen={viewDialog.isOpen}
        message={viewDialog.message}
        loading={viewDialog.loading}
        onClose={viewDialog.close}
        onToggleRead={() => {
          if (viewDialog.message) {
            handleToggleRead(viewDialog.message);
            viewDialog.close();
          }
        }}
      />
    </div>
  );
};

export default ContactMessagesPage;