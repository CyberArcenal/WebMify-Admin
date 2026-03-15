// src/pages/users/components/UserActionsDropdown.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Shield,
  ShieldOff,
  Crown,
  CirclePowerIcon,
} from "lucide-react";
import type { UserWithDetails } from "../hooks/useUsers";

interface UserActionsDropdownProps {
  user: UserWithDetails;
  onView: (user: UserWithDetails) => void;
  onEdit: (user: UserWithDetails) => void;
  onDelete: (user: UserWithDetails) => void;
  onToggleActive?: (user: UserWithDetails) => void;
  onToggleStaff?: (user: UserWithDetails) => void;
  onToggleSuperuser?: (user: UserWithDetails) => void;
}

const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({
  user,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleStaff,
  onToggleSuperuser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDropdownPosition = () => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 200;
    const windowHeight = window.innerHeight;

    if (rect.bottom + dropdownHeight > windowHeight) {
      return {
        bottom: `${windowHeight - rect.top + 5}px`,
        right: `${window.innerWidth - rect.right}px`,
      };
    }
    return {
      top: `${rect.bottom + 5}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  };

  return (
    <div className="user-actions-dropdown-container" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors relative cursor-pointer"
        title="More Actions"
      >
        <MoreVertical
          className="w-4 h-4"
          style={{ color: "var(--text-secondary)" }}
        />
      </button>

      {isOpen && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 w-48 z-50 max-h-96 overflow-y-auto"
          style={getDropdownPosition()}
        >
          <div className="py-1">
            {/* View Details */}
            <button
              onClick={() => handleAction(() => onView(user))}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Eye className="w-4 h-4 text-sky-500" />
              <span>View Details</span>
            </button>

            {/* Edit */}
            <button
              onClick={() => handleAction(() => onEdit(user))}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 text-yellow-500" />
              <span>Edit</span>
            </button>

            {/* Toggle Active */}
            {user.is_active ? (
              <button
                onClick={() => handleAction(() => onToggleActive?.(user))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <XCircle className="w-4 h-4 text-orange-500" />
                <span>Deactivate</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction(() => onToggleActive?.(user))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Activate</span>
              </button>
            )}

            {/* Toggle Staff */}
            {user.is_staff ? (
              <button
                onClick={() => handleAction(() => onToggleStaff?.(user))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <ShieldOff className="w-4 h-4 text-orange-500" />
                <span>Remove Staff</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction(() => onToggleStaff?.(user))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <Shield className="w-4 h-4 text-green-500" />
                <span>Make Staff</span>
              </button>
            )}

            {/* Toggle Superuser */}
            {user.is_superuser ? (
              <button
                onClick={() => handleAction(() => onToggleSuperuser?.(user))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <CirclePowerIcon className="w-4 h-4 text-orange-500" />
                <span>Remove Superuser</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction(() => onToggleSuperuser?.(user))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <Crown className="w-4 h-4 text-green-500" />
                <span>Make Superuser</span>
              </button>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 my-1"></div>

            {/* Delete */}
            <button
              onClick={() => handleAction(() => onDelete(user))}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActionsDropdown;