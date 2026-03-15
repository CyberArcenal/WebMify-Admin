// src/pages/subscribers/components/SubscriberTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, CheckCircle, XCircle, Mail } from "lucide-react";
import type { SubscriberWithDetails } from "../hooks/useSubscribers";
import { formatDate } from "@/utils/formatters";
import SubscriberActionsDropdown from "./SubscriberActionsDropdown";

interface SubscriberTableProps {
  subscribers: SubscriberWithDetails[];
  selectedSubscribers: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (subscriber: SubscriberWithDetails) => void;
  onDelete: (subscriber: SubscriberWithDetails) => void;
  onToggleActive?: (subscriber: SubscriberWithDetails) => void;
  onToggleConfirmed?: (subscriber: SubscriberWithDetails) => void;
}

const SubscriberTable: React.FC<SubscriberTableProps> = ({
  subscribers,
  selectedSubscribers,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onDelete,
  onToggleActive,
  onToggleConfirmed,
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

  const getConfirmedBadge = (confirmed: boolean) => {
    return confirmed
      ? "bg-[var(--accent-blue-light)] text-[var(--accent-blue)]"
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
                  subscribers?.length > 0 &&
                  selectedSubscribers?.length === subscribers?.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
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
              onClick={() => onSort("subscribed_at")}
            >
              <div className="flex items-center gap-xs">
                <span>Subscribed</span>
                {getSortIcon("subscribed_at")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("is_active")}
            >
              <div className="flex items-center gap-xs">
                <span>Status</span>
                {getSortIcon("is_active")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("confirmed")}
            >
              <div className="flex items-center gap-xs">
                <span>Confirmed</span>
                {getSortIcon("confirmed")}
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
          {subscribers?.map((sub) => (
            <tr
              key={sub.id}
              onClick={() => onView(sub)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedSubscribers?.includes(sub.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedSubscribers?.includes(sub.id)}
                  onChange={() => onToggleSelect(sub.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {sub.email}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(sub.subscribed_at)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getActiveBadge(
                    sub.is_active,
                  )}`}
                >
                  {sub.is_active ? (
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
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getConfirmedBadge(
                    sub.confirmed,
                  )}`}
                >
                  {sub.confirmed ? "Confirmed" : "Unconfirmed"}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <SubscriberActionsDropdown
                  subscriber={sub}
                  onView={onView}
                  onDelete={onDelete}
                  onToggleActive={onToggleActive}
                  onToggleConfirmed={onToggleConfirmed}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriberTable;