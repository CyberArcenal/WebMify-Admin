// src/pages/project-techstacks/components/ProjectTechStackFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import projectTechStackAPI, { ProjectTechStack, ProjectTechStackCreateData } from "@/api/core/project_techstack";

interface ProjectTechStackFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  itemId: number | null;
  initialData: Partial<ProjectTechStack> | null;
  projectId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  category: string;
  icon: string;
  order: number;
};

const ProjectTechStackFormDialog: React.FC<ProjectTechStackFormDialogProps> = ({
  isOpen,
  mode,
  itemId,
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
      name: "",
      category: "",
      icon: "",
      order: 0,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        category: initialData.category || "",
        icon: initialData.icon || "",
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
      const payload: ProjectTechStackCreateData = {
        project: projectId,
        name: data.name,
        category: data.category || "",
        icon: data.icon || "",
        order: data.order,
      };

      if (mode === "add") {
        if (!data.name) throw new Error("Name is required");
        await projectTechStackAPI.create(projectId, payload);
        dialogs.success("Tech stack item created successfully");
      } else {
        if (!itemId) throw new Error("Item ID missing");
        await projectTechStackAPI.update(projectId, itemId, payload);
        dialogs.success("Tech stack item updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save tech stack item");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Tech Stack Item" : "Edit Tech Stack Item"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Name *
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Category
          </label>
          <input
            {...register("category")}
            className="compact-input w-full border rounded-md"
            placeholder="e.g., Frontend, Backend, Database"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Icon
          </label>
          <input
            {...register("icon")}
            className="compact-input w-full border rounded-md"
            placeholder="e.g., fa-code, react-icon"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
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

export default ProjectTechStackFormDialog;