// src/pages/contact-messages/components/ContactMessageViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  User,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Globe,
} from "lucide-react";
import { ContactMessage } from "@/api/core/contact_message";
import { formatDate } from "@/utils/formatters";

interface ContactMessageViewDialogProps {
  isOpen: boolean;
  message: ContactMessage | null;
  loading: boolean;
  onClose: () => void;
  onToggleRead?: () => void;
}

const ContactMessageViewDialog: React.FC<ContactMessageViewDialogProps> = ({
  isOpen,
  message,
  loading,
  onClose,
  onToggleRead,
}) => {
  if (!message && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Message Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : message ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {message.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {message.email} • ID: {message.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    message.is_read
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.is_read ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Read
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      Unread
                    </>
                  )}
                </span>
              </div>
              {onToggleRead && (
                <Button
                  variant={message.is_read ? "warning" : "success"}
                  size="sm"
                  onClick={onToggleRead}
                >
                  {message.is_read ? "Mark Unread" : "Mark Read"}
                </Button>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-1 flex items-center text-[var(--sidebar-text)]">
              <MessageSquare className="w-4 h-4 mr-1" /> Subject
            </h4>
            <p className="text-md font-medium text-[var(--sidebar-text)]">
              {message.subject}
            </p>
          </div>

          {/* Message */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Mail className="w-4 h-4 mr-1" /> Message
            </h4>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
              {message.message}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Calendar className="w-4 h-4 mr-1" /> Received
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {formatDate(message.created_at)}
              </p>
            </div>

            {message.ip_address && (
              <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                  <Globe className="w-4 h-4 mr-1" /> IP Address
                </h4>
                <p className="text-sm text-[var(--sidebar-text)]">
                  {message.ip_address}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Message not found.
        </p>
      )}
    </Modal>
  );
};

export default ContactMessageViewDialog;