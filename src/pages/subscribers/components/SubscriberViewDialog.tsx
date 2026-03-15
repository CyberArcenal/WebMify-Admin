// src/pages/subscribers/components/SubscriberViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import {
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Key,
  Lock,
} from "lucide-react";
import { Subscriber } from "@/api/core/subscriber";
import { formatDate } from "@/utils/formatters";

interface SubscriberViewDialogProps {
  isOpen: boolean;
  subscriber: Subscriber | null;
  loading: boolean;
  onClose: () => void;
}

const SubscriberViewDialog: React.FC<SubscriberViewDialogProps> = ({
  isOpen,
  subscriber,
  loading,
  onClose,
}) => {
  if (!subscriber && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subscriber Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : subscriber ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--accent-blue)] text-white">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                {subscriber.email}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                ID: {subscriber.id}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Status</h4>
              <div className="flex items-center gap-2">
                {subscriber.is_active ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-700">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">Inactive</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Confirmed</h4>
              <div className="flex items-center gap-2">
                {subscriber.confirmed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-700">Confirmed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Unconfirmed</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Calendar className="w-4 h-4 mr-1" /> Subscribed
            </h4>
            <p className="text-sm text-[var(--sidebar-text)]">
              {formatDate(subscriber.subscribed_at)}
            </p>
          </div>

          {/* Tokens */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Key className="w-4 h-4 mr-1" /> Confirmation Token
            </h4>
            <p className="text-xs font-mono text-[var(--text-secondary)] break-all">
              {subscriber.confirmation_token}
            </p>
          </div>
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Lock className="w-4 h-4 mr-1" /> Unsubscribe Token
            </h4>
            <p className="text-xs font-mono text-[var(--text-secondary)] break-all">
              {subscriber.unsubscribe_token}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Subscriber not found.
        </p>
      )}
    </Modal>
  );
};

export default SubscriberViewDialog;