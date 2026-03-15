// src/pages/project-features/components/ProjectFeatureFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import projectFeatureAPI, { ProjectFeature, ProjectFeatureCreateData } from "@/api/core/project_feature";

interface ProjectFeatureFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  featureId: number | null;
  initialData: Partial<ProjectFeature> | null;
  projectId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  description: string;
  order: number;
};

const ProjectFeatureFormDialog: React.FC<ProjectFeatureFormDialogProps> = ({
  isOpen,
  mode,
  featureId,
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
      description: "",
      order: 0,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        description: initialData.description || "",
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
      const payload: ProjectFeatureCreateData = {
        project: projectId,
        description: data.description,
        order: data.order,
      };

      if (mode === "add") {
        if (!data.description) throw new Error("Description is required");
        await projectFeatureAPI.create(projectId, payload);
        dialogs.success("Feature created successfully");
      } else {
        if (!featureId) throw new Error("Feature ID missing");
        await projectFeatureAPI.update(featureId, payload);
        dialogs.success("Feature updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save feature");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Feature" : "Edit Feature"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Description *
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={4}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
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

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFeatureFormDialog;