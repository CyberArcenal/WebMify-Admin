// src/pages/project-gallery/components/ProjectGalleryFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import projectGalleryAPI, {
  ProjectGalleryImage,
  ProjectGalleryImageCreateData,
} from "@/api/core/project_gallery";

interface ProjectGalleryFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  imageId: number | null;
  initialData: Partial<ProjectGalleryImage> | null;
  projectId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  order: number;
  image: FileList;
};

const ProjectGalleryFormDialog: React.FC<ProjectGalleryFormDialogProps> = ({
  isOpen,
  mode,
  imageId,
  initialData,
  projectId,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      order: 0,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        order: initialData.order || 0,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    if (!projectId) {
      dialogs.error("No project selected");
      return;
    }

    try {
      if (mode === "add") {
        if (!data.image || data.image.length === 0) {
          throw new Error("Image file is required");
        }

        const payload: ProjectGalleryImageCreateData = {
          project: projectId,
          image: data.image[0],
          order: data.order,
        };

        await projectGalleryAPI.create(projectId, payload);
        dialogs.success("Image added successfully");
      } else {
        if (!imageId) throw new Error("Image ID missing");

        const payload: Partial<ProjectGalleryImageCreateData> = {};
        if (data.order !== undefined) payload.order = data.order;
        if (data.image && data.image.length > 0) payload.image = data.image[0];

        await projectGalleryAPI.update(imageId, payload);
        dialogs.success("Image updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save image");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Image" : "Edit Image"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Order */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Display Order
          </label>
          <input
            type="number"
            {...register("order", { valueAsNumber: true })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            {mode === "add"
              ? "Image File *"
              : "Image File (leave empty to keep current)"}
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image", {
              required: mode === "add" ? "Image is required" : false,
            })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              if (
                !(await dialogs.confirm({
                  title: "Cancel Form",
                  message:
                    "Are you sure do you want to cancel this form your data may be loss?.",
                  confirmText: "Cancel Anyway",
                }))
              )
                return;

              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "add" ? "Upload" : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectGalleryFormDialog;
