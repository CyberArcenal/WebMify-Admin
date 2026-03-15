// src/pages/project-features/components/ProjectFeatureViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  Layers,
  Edit,
  Hash,
} from "lucide-react";
import { ProjectFeature } from "@/api/core/project_feature";

interface ProjectFeatureViewDialogProps {
  isOpen: boolean;
  feature: ProjectFeature | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (feature: ProjectFeature) => void;
}

const ProjectFeatureViewDialog: React.FC<ProjectFeatureViewDialogProps> = ({
  isOpen,
  feature,
  loading,
  onClose,
  onEdit,
}) => {
  if (!feature && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Feature Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : feature ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  Feature #{feature.id}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Project ID: {feature.project}
                </p>
              </div>
            </div>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(feature)}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          {/* Description */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
              Description
            </h4>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
              {feature.description}
            </p>
          </div>

          {/* Order */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Hash className="w-4 h-4 mr-1" /> Order
            </h4>
            <p className="text-sm text-[var(--sidebar-text)]">
              {feature.order}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Feature not found.
        </p>
      )}
    </Modal>
  );
};

export default ProjectFeatureViewDialog;