// src/pages/contact-messages/components/ContactMessageTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Mail, CheckCircle, XCircle } from "lucide-react";
import type { ContactMessageWithDetails } from "../hooks/useContactMessages";
import { formatDate } from "@/utils/formatters";
import ContactMessageActionsDropdown from "./ContactMessageActionsDropdown";

interface ContactMessageTableProps {
  messages: ContactMessageWithDetails[];
  selectedMessages: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onView: (message: ContactMessageWithDetails) => void;
  onDelete: (message: ContactMessageWithDetails) => void;
  onToggleRead?: (message: ContactMessageWithDetails) => void;
}

const ContactMessageTable: React.FC<ContactMessageTableProps> = ({
  messages,
  selectedMessages,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onDelete,
  onToggleRead,
}) => {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="icon-sm" />
    ) : (
      <ChevronDown className="icon-sm" />
    );
  };

  const getReadBadge = (isRead: boolean) => {
    return isRead
      ? "bg-[var(--accent-green-light)] text-[var(--accent-green)]"
      : "bg-[var(--accent-red-light)] text-[var(--accent-red)]";
  };

  const truncateSubject = (subject: string, maxLength = 30) => {
    if (subject.length <= maxLength) return subject;
    return subject.substring(0, maxLength) + "...";
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
                  messages?.length > 0 &&
                  selectedMessages?.length === messages?.length
                }
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("id")}
            >
              <div className="flex items-center gap-xs">
                <span>ID</span>
                {getSortIcon("id")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-xs">
                <span>Name</span>
                {getSortIcon("name")}
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
              onClick={() => onSort("subject")}
            >
              <div className="flex items-center gap-xs">
                <span>Subject</span>
                {getSortIcon("subject")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("is_read")}
            >
              <div className="flex items-center gap-xs">
                <span>Status</span>
                {getSortIcon("is_read")}
              </div>
            </th>
            <th
              scope="col"
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors"
              onClick={() => onSort("created_at")}
            >
              <div className="flex items-center gap-xs">
                <span>Received</span>
                {getSortIcon("created_at")}
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
          {messages?.map((message) => (
            <tr
              key={message.id}
              onClick={() => onView(message)}
              className={`hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer ${
                selectedMessages?.includes(message.id)
                  ? "bg-[var(--accent-blue-dark)]"
                  : ""
              }`}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedMessages?.includes(message.id)}
                  onChange={() => onToggleSelect(message.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-mono" style={{ color: "var(--text-secondary)" }}>
                {message.id}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {message.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {message.email}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {truncateSubject(message.subject)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-xs py-xs rounded-full text-xs font-medium ${getReadBadge(
                    message.is_read,
                  )}`}
                >
                  {message.is_read ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Read
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Unread
                    </>
                  )}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(message.created_at)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                <ContactMessageActionsDropdown
                  message={message}
                  onView={onView}
                  onDelete={onDelete}
                  onToggleRead={onToggleRead}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactMessageTable;