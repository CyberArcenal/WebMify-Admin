// src/components/Selects/User/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, User, X, Shield, Mail } from "lucide-react";
import userAPI, { User as UserType } from "@/api/core/user";

interface UserSelectProps {
  value: number | null;
  onChange: (userId: number | null, user?: UserType) => void;
  disabled?: boolean;
  placeholder?: string;
  userType?: string; // filter by user_type
  status?: string;   // filter by status
  className?: string;
}

const UserSelect: React.FC<UserSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select a user...",
  userType,
  status,
  className = "w-full max-w-md",
}) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const params: any = {
          page_size: 100,
        };
        if (userType) params.user_type = userType;
        if (status) params.status = status;

        const response = await userAPI.list(params);
        setUsers(response.results);
        setFilteredUsers(response.results);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [userType, status]);

  // Filter users by search term (username, full name, email)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(lower) ||
          user.full_name.toLowerCase().includes(lower) ||
          user.email.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, users]);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Update dropdown position
  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (user: UserType) => {
    onChange(user.id, user);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const selectedUser = users.find((u) => u.id === value);

  // Helper to get user type badge color
  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "admin": return "text-red-500 bg-red-100";
      case "manager": return "text-purple-500 bg-purple-100";
      case "staff": return "text-blue-500 bg-blue-100";
      case "customer": return "text-green-500 bg-green-100";
      default: return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-lg text-left flex items-center gap-2
          transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--card-hover-bg)]"}
        `}
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
          minHeight: "42px",
        }}
      >
        <User
          className="w-4 h-4 flex-shrink-0"
          style={{ color: "var(--primary-color)" }}
        />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selectedUser ? (
            <>
              <span className="font-medium truncate">
                {selectedUser.full_name || selectedUser.username}
              </span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${getUserTypeColor(selectedUser.user_type)}`}
              >
                {selectedUser.user_type_display}
              </span>
            </>
          ) : (
            <span
              className="truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {placeholder}
            </span>
          )}
        </div>
        {selectedUser && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-[var(--card-hover-bg)] transition-colors flex-shrink-0"
            style={{ color: "var(--text-secondary)" }}
            title="Remove selected"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "var(--text-secondary)" }}
        />
      </button>

      {/* Portal dropdown */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] rounded-lg shadow-lg overflow-hidden"
            style={{
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              width: dropdownStyle.width,
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              maxHeight: "350px",
            }}
          >
            {/* Search bar */}
            <div
              className="p-2 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-secondary)" }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, username, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded text-sm"
                  style={{
                    backgroundColor: "var(--card-secondary-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* User list */}
            <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
              {loading && users.length === 0 ? (
                <div
                  className="p-3 text-center text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Loading...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div
                  className="p-3 text-center text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelect(user)}
                    className={`
                      w-full px-3 py-2 text-left flex items-start gap-2
                      transition-colors text-sm cursor-pointer hover:bg-[var(--card-hover-bg)]
                      ${user.id === value ? "bg-[var(--accent-blue-light)]" : ""}
                    `}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <User
                      className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {user.full_name || user.username}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${getUserTypeColor(user.user_type)}`}
                        >
                          {user.user_type_display}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-0.5">
                        <Mail className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
                        <span style={{ color: "var(--text-secondary)" }} className="truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default UserSelect;