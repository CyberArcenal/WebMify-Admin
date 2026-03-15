// src/pages/project-gallery/components/ProjectGalleryViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  Image,
  Edit,
  Hash,
} from "lucide-react";
import { ProjectGalleryImage } from "@/api/core/project_gallery";

interface ProjectGalleryViewDialogProps {
  isOpen: boolean;
  image: ProjectGalleryImage | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (image: ProjectGalleryImage) => void;
}

const ProjectGalleryViewDialog: React.FC<ProjectGalleryViewDialogProps> = ({
  isOpen,
  image,
  loading,
  onClose,
  onEdit,
}) => {
  if (!image && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Image Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : image ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <Image className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  Image #{image.id}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Project ID: {image.project}
                </p>
              </div>
            </div>
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(image)}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          {/* Image Preview */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md flex justify-center">
            {image.image_url ? (
              <img
                src={image.image_url}
                alt="Gallery"
                className="max-h-96 object-contain rounded"
              />
            ) : (
              <div className="h-40 w-40 bg-[var(--card-bg)] flex items-center justify-center rounded">
                <Image className="w-10 h-10 text-[var(--text-secondary)]" />
              </div>
            )}
          </div>

          {/* Order */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Hash className="w-4 h-4 mr-1" /> Order
            </h4>
            <p className="text-sm text-[var(--sidebar-text)]">
              {image.order}
            </p>
          </div>

          {/* URL */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
              Image URL
            </h4>
            <a
              href={image.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--accent-blue)] break-all hover:underline"
            >
              {image.image_url}
            </a>
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Image not found.
        </p>
      )}
    </Modal>
  );
};

export default ProjectGalleryViewDialog;