// src/pages/email-templates/components/EmailTemplateViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  Mail,
  Calendar,
  Edit,
} from "lucide-react";
import { EmailTemplate } from "@/api/core/email_template";
import { formatDate } from "@/utils/formatters";

interface EmailTemplateViewDialogProps {
  isOpen: boolean;
  template: EmailTemplate | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (template: EmailTemplate) => void;
}

const EmailTemplateViewDialog: React.FC<EmailTemplateViewDialogProps> = ({
  isOpen,
  template,
  loading,
  onClose,
  onEdit,
}) => {
  if (!template && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Template Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : template ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {template.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  ID: {template.id}
                </p>
              </div>
            </div>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(template)}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          {/* Subject */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-1 flex items-center text-[var(--sidebar-text)]">
              <Mail className="w-4 h-4 mr-1" /> Subject
            </h4>
            <p className="text-md font-medium text-[var(--sidebar-text)]">
              {template.subject}
            </p>
          </div>

          {/* Content */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
              Content
            </h4>
            <div className="text-sm text-[var(--text-secondary)] whitespace-pre-line border rounded-md p-2 bg-[var(--card-bg)]">
              {template.content}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Calendar className="w-4 h-4 mr-1" /> Created
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {formatDate(template.created_at)}
              </p>
            </div>
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Calendar className="w-4 h-4 mr-1" /> Modified
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {formatDate(template.modified_at)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Template not found.
        </p>
      )}
    </Modal>
  );
};

export default EmailTemplateViewDialog;