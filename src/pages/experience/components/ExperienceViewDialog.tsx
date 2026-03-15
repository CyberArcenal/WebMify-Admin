// src/pages/experience/components/ExperienceViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  Briefcase,
  Calendar,
  Edit,
  Building,
  AlignLeft,
} from "lucide-react";
import { Experience } from "@/api/core/experience";
import { formatDate } from "@/utils/formatters";

interface ExperienceViewDialogProps {
  isOpen: boolean;
  experience: Experience | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (experience: Experience) => void;
}

const ExperienceViewDialog: React.FC<ExperienceViewDialogProps> = ({
  isOpen,
  experience,
  loading,
  onClose,
  onEdit,
}) => {
  if (!experience && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Experience Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : experience ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {experience.company_logo_url ? (
                <img
                  src={experience.company_logo_url}
                  alt={experience.company}
                  className="w-12 h-12 rounded-md object-contain bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {experience.position}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {experience.company} • ID: {experience.id}
                </p>
              </div>
            </div>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(experience)}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          {/* Description */}
          {experience.description && (
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <AlignLeft className="w-4 h-4 mr-1" /> Description
              </h4>
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
                {experience.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Building className="w-4 h-4 mr-1" /> Company
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {experience.company}
              </p>
            </div>

            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                <Calendar className="w-4 h-4 mr-1" /> Duration
              </h4>
              <p className="text-sm text-[var(--sidebar-text)]">
                {formatDate(experience.start_date)} -{" "}
                {experience.current ? "Present" : (experience.end_date ? formatDate(experience.end_date) : "N/A")}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {experience.duration}
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
                {experience.order}
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Current:</span>{" "}
                {experience.current ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Experience record not found.
        </p>
      )}
    </Modal>
  );
};

export default ExperienceViewDialog;