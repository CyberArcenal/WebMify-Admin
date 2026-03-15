// src/pages/project-techstacks/components/ProjectTechStackViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  Cpu,
  Edit,
  Hash,
  Tag,
} from "lucide-react";
import { ProjectTechStack } from "@/api/core/project_techstack";

interface ProjectTechStackViewDialogProps {
  isOpen: boolean;
  item: ProjectTechStack | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (item: ProjectTechStack) => void;
}

const ProjectTechStackViewDialog: React.FC<ProjectTechStackViewDialogProps> = ({
  isOpen,
  item,
  loading,
  onClose,
  onEdit,
}) => {
  if (!item && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tech Stack Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : item ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {item.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  ID: {item.id} • Project ID: {item.project}
                </p>
              </div>
            </div>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(item)}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          {/* Category */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Tag className="w-4 h-4 mr-1" /> Category
            </h4>
            <p className="text-sm text-[var(--sidebar-text)]">
              {item.category}
            </p>
          </div>

          {/* Order */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Hash className="w-4 h-4 mr-1" /> Order
            </h4>
            <p className="text-sm text-[var(--sidebar-text)]">
              {item.order}
            </p>
          </div>

          {/* Icon */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
              Icon
            </h4>
            {item.icon ? (
              <div>
                <p className="text-sm text-[var(--sidebar-text)] mb-1">
                  {item.icon}
                </p>
                <div className="text-4xl">
                  {/* You could render an actual icon here if you have a library */}
                  <span className="text-[var(--accent-blue)]">⚙️</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">No icon</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Tech stack item not found.
        </p>
      )}
    </Modal>
  );
};

export default ProjectTechStackViewDialog;