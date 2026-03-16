// src/pages/skills/components/SkillFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import skillAPI, { Skill, SkillCreateData } from "@/api/core/skill";

interface SkillFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  skillId: number | null;
  initialData: Partial<Skill> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  order: number;
  featured: boolean;
};

const SkillFormDialog: React.FC<SkillFormDialogProps> = ({
  isOpen,
  mode,
  skillId,
  initialData,
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
      proficiency: 50,
      icon: "",
      order: 0,
      featured: false,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        category: initialData.category || "",
        proficiency: initialData.proficiency || 50,
        icon: initialData.icon || "",
        order: initialData.order || 0,
        featured: initialData.featured || false,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: SkillCreateData = {
        name: data.name,
        category: data.category,
        proficiency: data.proficiency,
        icon: data.icon || undefined,
        order: data.order,
        featured: data.featured,
      };

      if (mode === "add") {
        if (!data.name || !data.category || data.proficiency === undefined) {
          throw new Error("Required fields are missing");
        }
        await skillAPI.create(payload);
        dialogs.success("Skill created successfully");
      } else {
        if (!skillId) throw new Error("Skill ID missing");
        await skillAPI.update(skillId, payload);
        dialogs.success("Skill updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save skill");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Skill" : "Edit Skill"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
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
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          >
            <option value="">-- Select Category --</option>
            <option value="language">Programming Languages</option>
            <option value="frontend">Frontend Development</option>
            <option value="backend">Backend & Databases</option>
            <option value="devops">DevOps & Cloud</option>
            <option value="framework">Frameworks & Libraries</option>
            <option value="design">Design & Tools</option>
            <option value="business">Business & Professional</option>
            <option value="creative">Creative & Media</option>
            <option value="academic">Academic & Research</option>
            <option value="personal">Personal Development</option>
            <option value="community">Community & Social Impact</option>
          </select>
          {errors.category && (
            <p className="text-xs text-red-500 mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Proficiency */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Proficiency (0-100) *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            {...register("proficiency", {
              required: "Proficiency is required",
              valueAsNumber: true,
              min: { value: 0, message: "Minimum 0" },
              max: { value: 100, message: "Maximum 100" },
            })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.proficiency && (
            <p className="text-xs text-red-500 mt-1">
              {errors.proficiency.message}
            </p>
          )}
        </div>

        {/* Icon */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Icon
          </label>
          <input
            {...register("icon")}
            className="compact-input w-full border rounded-md"
            placeholder="e.g., fa-react, devicon-python"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

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

        {/* Featured Checkbox */}
        <div>
          <label
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--sidebar-text)" }}
          >
            <input
              type="checkbox"
              {...register("featured")}
              className="h-4 w-4"
            />
            Featured
          </label>
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
            {isSubmitting ? "Saving..." : mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SkillFormDialog;
