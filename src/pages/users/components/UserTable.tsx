// src/pages/users/components/UserTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, CheckCircle, XCircle, Shield, ShieldCheck, Crown } from "lucide-react";
import type { UserWithDetails } from "../hooks/useUsers";
import { formatDate } from "@/utils/formatters";
import UserActionsDropdown from "./UserActionsDropdown";

interface UserTableProps {
  users: UserWithDetails[];
  selectedUsers: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (user: UserWithDetails) => void;
  onEdit: (user: UserWithDetails) => void;
  onDelete: (user: UserWithDetails) => void;
  onToggleActive?: (user: UserWithDetails) => void;
  onToggleStaff?: (user: UserWithDetails) => void;
  onToggleSuperuser?: (user: UserWithDetails) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleStaff,
  onToggleSuperuser,
}) => {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="icon-sm" />
    ) : (
      <ChevronDown className="icon-sm" />
    );
  };

  const getActiveBadge = (isActive: boolean) => {
    return isActive
      ? "bg-[var(--accent-green-light)] text-[var(--accent-green)]"
      : "bg-[var(--accent-red-light)] text-[var(--accent-red)]";
  };

  const getStaffBadge = (isStaff: boolean) => {
    return isStaff
      ? "bg-[var(--accent-blue-light)] text-[var(--accent-blue)]"
      : "bg-[var(--accent-gray-light)] text-[var(--text-secondary)]";
  };

  const getSuperuserBadge = (isSuperuser: boolean) => {
    return isSuperuser
      ? "bg-[var(--accent-yellow-light)] text-[var(--accent-yellow)]"
      : "bg-[var(--accent-gray-light)] text-[var(--text-secondary)]";
  };

  return (
    <div
      className="overflow-x-auto rounded-md border compact-table"
      style={{ borderColor: "var(--border-color)" }}
    >
      <table
        className="min-w-full"
        style={{ borderColor: "var(--border-color)" }}
      >
        <thead style={{ backgroundColor: "var(--card-secondary-bg)" }}>
          <tr>
            <th
              scope="col"
              className="w-10 px-2 py-2 text-left text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              <input
                type="checkbox"
                checked={
                  users?.length > 0 &&
                  selectedUsers?.length === users?.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("username")}
            >
              <div className="flex items-center gap-xs">
                <span>Username</span>
                {getSortIcon("username")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("email")}
            >
              <div className="flex items-center gap-xs">
                <span>Email</span>
                {getSortIcon("email")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("full_name")}
            >
              <div className="flex items-center gap-xs">
                <span>Full Name</span>
                {getSortIcon("full_name")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("user_type")}
            >
              <div className="flex items-center gap-xs">
                <span>User Type</span>
                {getSortIcon("user_type")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("is_active")}
            >
              <div className="flex items-center gap-xs">
                <span>Active</span>
                {getSortIcon("is_active")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("is_staff")}
            >
              <div className="flex items-center gap-xs">
                <span>Staff</span>
                {getSortIcon("is_staff")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("is_superuser")}
            >
              <div className="flex items-center gap-xs">
                <span>Superuser</span>
                {getSortIcon("is_superuser")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("date_joined")}
            >
              <div className="flex items-center gap-xs">
                <span>Joined</span>
                {getSortIcon("date_joined")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {users?.map((user) => (
            <tr
              key={user.id}
              onClick={() => onView(user)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedUsers?.includes(user.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedUsers?.includes(user.id)}
                  onChange={() => onToggleSelect(user.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {user.username}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {user.email}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {user.full_name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {user.user_type_display}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getActiveBadge(
                    user.is_active,
                  )}`}
                >
                  {user.is_active ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getStaffBadge(
                    user.is_staff,
                  )}`}
                >
                  {user.is_staff ? (
                    <>
                      <Shield className="w-3 h-3 mr-1" />
                      Staff
                    </>
                  ) : (
                    "User"
                  )}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getSuperuserBadge(
                    user.is_superuser,
                  )}`}
                >
                  {user.is_superuser ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Superuser
                    </>
                  ) : (
                    "No"
                  )}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(user.date_joined)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <UserActionsDropdown
                  user={user}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleActive={onToggleActive}
                  onToggleStaff={onToggleStaff}
                  onToggleSuperuser={onToggleSuperuser}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;