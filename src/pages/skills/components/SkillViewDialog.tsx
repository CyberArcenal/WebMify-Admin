// src/pages/skills/components/SkillViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  Code,
  Edit,
  Hash,
  Star,
} from "lucide-react";
import { Skill } from "@/api/core/skill";

interface SkillViewDialogProps {
  isOpen: boolean;
  skill: Skill | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (skill: Skill) => void;
  onToggleFeatured?: (skill: Skill) => void;
}

const SkillViewDialog: React.FC<SkillViewDialogProps> = ({
  isOpen,
  skill,
  loading,
  onClose,
  onEdit,
  onToggleFeatured,
}) => {
  if (!skill && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Skill Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : skill ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {skill.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  ID: {skill.id} • Category: {skill.category_display || skill.category}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {onToggleFeatured && (
                <Button
                  variant={skill.featured ? "warning" : "success"}
                  size="sm"
                  onClick={() => onToggleFeatured(skill)}
                >
                  <Star className="w-4 h-4 mr-1" />
                  {skill.featured ? "Unfeature" : "Feature"}
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(skill)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </div>

          {/* Proficiency */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
              Proficiency
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{skill.proficiency}%</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 rounded-full bg-[var(--accent-blue)]"
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Order */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Hash className="w-4 h-4 mr-1" /> Display Order
            </h4>
            <p className="text-sm text-[var(--sidebar-text)]">
              {skill.order}
            </p>
          </div>

          {/* Icon */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
              Icon
            </h4>
            {skill.icon ? (
              <div>
                <p className="text-sm text-[var(--sidebar-text)] mb-1">
                  {skill.icon}
                </p>
                <div className="text-4xl">
                  {/* Placeholder for actual icon rendering */}
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
          Skill not found.
        </p>
      )}
    </Modal>
  );
};

export default SkillViewDialog;