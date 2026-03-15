// src/pages/users/components/UserViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  User,
  Edit,
  Calendar,
  Mail,
  Phone,
  Shield,
  Crown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { User as UserType } from "@/api/core/user";
import { formatDate } from "@/utils/formatters";

interface UserViewDialogProps {
  isOpen: boolean;
  user: UserType | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (user: UserType) => void;
  onToggleActive?: (user: UserType) => void;
  onToggleStaff?: (user: UserType) => void;
  onToggleSuperuser?: (user: UserType) => void;
}

const UserViewDialog: React.FC<UserViewDialogProps> = ({
  isOpen,
  user,
  loading,
  onClose,
  onEdit,
  onToggleActive,
  onToggleStaff,
  onToggleSuperuser,
}) => {
  if (!user && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : user ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {user.full_name || user.username}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  @{user.username} • ID: {user.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
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
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.is_staff
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Shield className="w-3 h-3 mr-1" />
              {user.is_staff ? "Staff" : "Regular User"}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                user.is_superuser
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Crown className="w-3 h-3 mr-1" />
              {user.is_superuser ? "Superuser" : "Not Superuser"}
            </span>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Mail className="w-4 h-4 mr-1" /> Email
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">{user.email}</p>
            </div>
            {user.phone_number && (
              <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                  <Phone className="w-4 h-4 mr-1" /> Phone
                </h4>
                <p className="text-sm text-[var(--sidebar-text)]">{user.phone_number}</p>
              </div>
            )}
          </div>

          {/* User Type and Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">User Type</h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {user.user_type_display}
              </p>
            </div>
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Status</h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {user.status_display}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Calendar className="w-4 h-4 mr-1" /> Date Joined
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {formatDate(user.date_joined)}
              </p>
            </div>
            {user.last_login && (
              <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                  <Calendar className="w-4 h-4 mr-1" /> Last Login
                </h4>
                <p className="text-sm text-[var(--sidebar-text)]">
                  {formatDate(user.last_login)}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          User not found.
        </p>
      )}
    </Modal>
  );
};

export default UserViewDialog;