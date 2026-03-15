// src/pages/subscribers/index.tsx
import React, { useState } from "react";
import { Filter, RefreshCw, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import Pagination from "../../components/Shared/Pagination1";
import { dialogs } from "../../utils/dialogs";
import { showSuccess, showError } from "../../utils/notification";

import useSubscribers, { type SubscriberWithDetails } from "./hooks/useSubscribers";
import SubscriberTable from "./components/SubscriberTable";
import subscriberAPI from "@/api/core/subscriber";
import { useSubscriberView } from "./hooks/useSubscriberView";
import FilterBar from "./components/FilterBar";
import SubscriberViewDialog from "./components/SubscriberViewDialog";

const SubscribersPage: React.FC = () => {
  const {
    subscribers,
    paginatedSubscribers,
    filters,
    loading,
    error,
    pagination,
    selectedSubscribers,
    setSelectedSubscribers,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleSubscriberSelection,
    toggleSelectAll,
    handleSort,
  } = useSubscribers();

  const viewDialog = useSubscriberView();

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleActive = async (subscriber: SubscriberWithDetails) => {
    try {
      await subscriberAPI.patch(subscriber.id, { is_active: !subscriber.is_active });
      showSuccess(
        subscriber.is_active ? "Subscriber deactivated" : "Subscriber activated",
      );
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleToggleConfirmed = async (subscriber: SubscriberWithDetails) => {
    try {
      await subscriberAPI.patch(subscriber.id, { confirmed: !subscriber.confirmed });
      showSuccess(
        subscriber.confirmed ? "Marked as unconfirmed" : "Marked as confirmed",
      );
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDelete = async (subscriber: SubscriberWithDetails) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Subscriber",
      message: `Are you sure you want to delete ${subscriber.email}?`,
    });
    if (!confirmed) return;
    try {
      await subscriberAPI.delete(subscriber.id);
      showSuccess("Subscriber deleted successfully.");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers?.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedSubscribers?.length} subscribers?`,
    });
    if (!confirmed) return;
    try {
      await Promise.all(
        selectedSubscribers?.map((id) => subscriberAPI.delete(id)),
      );
      showSuccess(`${selectedSubscribers?.length} subscribers deleted.`);
      setSelectedSubscribers([]);
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
            Subscribers
          </h2>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage newsletter subscribers
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
      {subscribers?.length > 0 && (
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
              {subscribers?.filter((s) => s.is_active).length} Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-gray)]"></span>
              {subscribers?.filter((s) => !s.is_active).length} Inactive
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)]"></span>
              {subscribers?.filter((s) => s.confirmed).length} Confirmed
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Total: {pagination.count} subscribers
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
      {selectedSubscribers?.length > 0 && (
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
            {selectedSubscribers?.length} subscriber(s) selected
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
          <SubscriberTable
            subscribers={paginatedSubscribers}
            selectedSubscribers={selectedSubscribers}
            onToggleSelect={toggleSubscriberSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(sub) => viewDialog.open(sub.id)}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onToggleConfirmed={handleToggleConfirmed}
          />

          {/* Empty State */}
          {subscribers?.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Mail
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No subscribers found.
              </p>
              <p
                className="mt-xs text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {Object.values(filters).some((v) => v)
                  ? "Try adjusting your filters"
                  : "Subscribers will appear when people sign up"}
              </p>
              <div className="mt-2">
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
              </div>
            </div>
          )}

          {/* Pagination */}
          {subscribers?.length > 0 && pagination.total_pages > 1 && (
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
      <SubscriberViewDialog
        isOpen={viewDialog.isOpen}
        subscriber={viewDialog.subscriber}
        loading={viewDialog.loading}
        onClose={viewDialog.close}
      />
    </div>
  );
};

export default SubscribersPage;