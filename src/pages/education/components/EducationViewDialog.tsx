// src/pages/education/components/EducationViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  GraduationCap,
  Calendar,
  Edit,
  Building,
  BookOpen,
} from "lucide-react";
import { Education } from "@/api/core/education";
import { formatDate } from "@/utils/formatters";

interface EducationViewDialogProps {
  isOpen: boolean;
  education: Education | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (education: Education) => void;
}

const EducationViewDialog: React.FC<EducationViewDialogProps> = ({
  isOpen,
  education,
  loading,
  onClose,
  onEdit,
}) => {
  if (!education && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Education Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : education ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {education.institution_logo_url ? (
                <img
                  src={education.institution_logo_url}
                  alt={education.institution}
                  className="w-12 h-12 rounded-md object-contain bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                  <GraduationCap className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {education.degree} in {education.field_of_study}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {education.institution} • ID: {education.id}
                </p>
              </div>
            </div>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(education)}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          {/* Description */}
          {education.description && (
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <BookOpen className="w-4 h-4 mr-1" /> Description
              </h4>
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
                {education.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Building className="w-4 h-4 mr-1" /> Institution
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {education.institution}
              </p>
            </div>

            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Calendar className="w-4 h-4 mr-1" /> Duration
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {formatDate(education.start_date)} -{" "}
                {education.current ? "Present" : (education.end_date ? formatDate(education.end_date) : "N/A")}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {education.duration}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
              Additional Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[var(--text-secondary)]">Order:</span>{" "}
                {education.order}
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Current:</span>{" "}
                {education.current ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Education record not found.
        </p>
      )}
    </Modal>
  );
};

export default EducationViewDialog;