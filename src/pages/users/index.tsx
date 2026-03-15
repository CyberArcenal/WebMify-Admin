// src/pages/users/index.tsx
import React, { useState } from "react";
import { Plus, Filter, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import Pagination from "../../components/Shared/Pagination1";
import { dialogs } from "../../utils/dialogs";
import { showSuccess, showError } from "../../utils/notification";

import useUsers, { type UserWithDetails } from "./hooks/useUsers";
import UserTable from "./components/UserTable";
import userAPI from "@/api/core/user";
import useUserForm from "./hooks/useUserForm";
import { useUserView } from "./hooks/useUserView";
import FilterBar from "./components/FilterBar";
import UserFormDialog from "./components/UserFormDialog";
import UserViewDialog from "./components/UserViewDialog";

const UsersPage: React.FC = () => {
  const {
    users,
    paginatedUsers,
    filters,
    loading,
    error,
    pagination,
    selectedUsers,
    setSelectedUsers,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleUserSelection,
    toggleSelectAll,
    handleSort,
  } = useUsers();

  const formDialog = useUserForm();
  const viewDialog = useUserView();

  const [showFilters, setShowFilters] = useState(false);

  const handleToggleActive = async (user: UserWithDetails) => {
    try {
      await userAPI.patch(user.id, { is_active: !user.is_active });
      showSuccess(
        user.is_active ? "User deactivated" : "User activated",
      );
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleToggleStaff = async (user: UserWithDetails) => {
    try {
      await userAPI.patch(user.id, { is_staff: !user.is_staff });
      showSuccess(
        user.is_staff ? "Staff privileges removed" : "Staff privileges granted",
      );
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleToggleSuperuser = async (user: UserWithDetails) => {
    try {
      await userAPI.patch(user.id, { is_superuser: !user.is_superuser });
      showSuccess(
        user.is_superuser ? "Superuser privileges removed" : "Superuser privileges granted",
      );
      reload();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDelete = async (user: UserWithDetails) => {
    const confirmed = await dialogs.confirm({
      title: "Delete User",
      message: `Are you sure you want to delete user "${user.username}"?`,
    });
    if (!confirmed) return;
    try {
      await userAPI.delete(user.id);
      showSuccess("User deleted successfully.");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers?.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedUsers?.length} users?`,
    });
    if (!confirmed) return;
    try {
      await Promise.all(
        selectedUsers?.map((id) => userAPI.delete(id)),
      );
      showSuccess(`${selectedUsers?.length} users deleted.`);
      setSelectedUsers([]);
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
            Users
          </h2>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage system users and permissions
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
            Add User
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {users?.length > 0 && (
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
              {users?.filter((u) => u.is_active).length} Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-red)]"></span>
              {users?.filter((u) => !u.is_active).length} Inactive
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)]"></span>
              {users?.filter((u) => u.is_staff).length} Staff
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-yellow)]"></span>
              {users?.filter((u) => u.is_superuser).length} Superuser
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Total: {pagination.count} users
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
      {selectedUsers?.length > 0 && (
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
            {selectedUsers?.length} user(s) selected
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
          <UserTable
            users={paginatedUsers}
            selectedUsers={selectedUsers}
            onToggleSelect={toggleUserSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(user) => viewDialog.open(user.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onToggleStaff={handleToggleStaff}
            onToggleSuperuser={handleToggleSuperuser}
          />

          {/* Empty State */}
          {users?.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Users
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No users found.
              </p>
              <p
                className="mt-xs text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {Object.values(filters).some((v) => v)
                  ? "Try adjusting your search or filters"
                  : "Start by creating your first user"}
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
                  Add First User
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {users?.length > 0 && pagination.total_pages > 1 && (
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
      <UserFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        userId={formDialog.userId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />

      <UserViewDialog
        isOpen={viewDialog.isOpen}
        user={viewDialog.user}
        loading={viewDialog.loading}
        onClose={viewDialog.close}
        onEdit={(user) => {
          formDialog.openEdit(user);
          viewDialog.close();
        }}
        onToggleActive={handleToggleActive}
        onToggleStaff={handleToggleStaff}
        onToggleSuperuser={handleToggleSuperuser}
      />
    </div>
  );
};

export default UsersPage;