// src/pages/experience/components/ExperienceFormDialog.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import experienceAPI, { Experience, ExperienceCreateData } from "@/api/core/experience";

interface ExperienceFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  experienceId: number | null;
  initialData: Partial<Experience> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  order: number;
  company_logo: FileList;
};

const ExperienceFormDialog: React.FC<ExperienceFormDialogProps> = ({
  isOpen,
  mode,
  experienceId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      company: "",
      position: "",
      description: "",
      start_date: "",
      end_date: "",
      current: false,
      order: 0,
    },
  });

  const current = watch("current");

  // When current is checked, clear end_date and disable it
  useEffect(() => {
    if (current) {
      setValue("end_date", "");
    }
  }, [current, setValue]);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        company: initialData.company || "",
        position: initialData.position || "",
        description: initialData.description || "",
        start_date: initialData.start_date?.split("T")[0] || "",
        end_date: initialData.end_date?.split("T")[0] || "",
        current: initialData.current || false,
        order: initialData.order || 0,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: ExperienceCreateData = {
        company: data.company,
        position: data.position,
        description: data.description,
        start_date: data.start_date,
        end_date: data.current ? null : (data.end_date || null),
        current: data.current,
        order: data.order,
      };

      // Handle file upload if present
      if (data.company_logo && data.company_logo.length > 0) {
        payload.company_logo = data.company_logo[0];
      }

      if (mode === "add") {
        if (!data.company || !data.position || !data.start_date) {
          throw new Error("Required fields are missing");
        }
        await experienceAPI.create(payload);
        dialogs.success("Experience record created successfully");
      } else {
        if (!experienceId) throw new Error("Experience ID missing");
        await experienceAPI.update(experienceId, payload);
        dialogs.success("Experience record updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save experience record");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Experience" : "Edit Experience"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Company */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Company *
          </label>
          <input
            {...register("company", { required: "Company is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company.message}</p>}
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Position *
          </label>
          <input
            {...register("position", { required: "Position is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position.message}</p>}
        </div>

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

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Start Date *
            </label>
            <input
              type="date"
              {...register("start_date", { required: "Start date is required" })}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
            {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              End Date
            </label>
            <input
              type="date"
              {...register("end_date")}
              disabled={current}
              className="compact-input w-full border rounded-md disabled:opacity-50"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
          </div>
        </div>

        {/* Current Checkbox */}
        <div>
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
            <input type="checkbox" {...register("current")} className="h-4 w-4" />
            I currently work here
          </label>
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

        {/* Company Logo */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Company Logo
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("company_logo")}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {initialData?.company_logo_url && (
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Current logo: {initialData.company_logo_url.split("/").pop()}
            </p>
          )}
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

export default ExperienceFormDialog;