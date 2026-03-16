// src/pages/education/components/EducationFormDialog.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import educationAPI, {
  Education,
  EducationCreateData,
} from "@/api/core/education";

interface EducationFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  educationId: number | null;
  initialData: Partial<Education> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  institution: string;
  degree: string;
  field_of_study: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  order: number;
  institution_logo: FileList;
};

const EducationFormDialog: React.FC<EducationFormDialogProps> = ({
  isOpen,
  mode,
  educationId,
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
      institution: "",
      degree: "",
      field_of_study: "",
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
        institution: initialData.institution || "",
        degree: initialData.degree || "",
        field_of_study: initialData.field_of_study || "",
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
      const payload: EducationCreateData = {
        institution: data.institution,
        degree: data.degree,
        field_of_study: data.field_of_study,
        description: data.description || undefined,
        start_date: data.start_date,
        end_date: data.current ? null : data.end_date || null,
        current: data.current,
        order: data.order,
      };

      // Handle file upload if present
      if (data.institution_logo && data.institution_logo.length > 0) {
        payload.institution_logo = data.institution_logo[0];
      }

      if (mode === "add") {
        if (
          !data.institution ||
          !data.degree ||
          !data.field_of_study ||
          !data.start_date
        ) {
          throw new Error("Required fields are missing");
        }
        await educationAPI.create(payload);
        dialogs.success("Education record created successfully");
      } else {
        if (!educationId) throw new Error("Education ID missing");
        await educationAPI.update(educationId, payload);
        dialogs.success("Education record updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save education record");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Education" : "Edit Education"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Institution */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Institution *
          </label>
          <input
            {...register("institution", {
              required: "Institution is required",
            })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.institution && (
            <p className="text-xs text-red-500 mt-1">
              {errors.institution.message}
            </p>
          )}
        </div>

        {/* Degree */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Degree *
          </label>
          <input
            {...register("degree", { required: "Degree is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.degree && (
            <p className="text-xs text-red-500 mt-1">{errors.degree.message}</p>
          )}
        </div>

        {/* Field of Study */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Field of Study *
          </label>
          <input
            {...register("field_of_study", {
              required: "Field of study is required",
            })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.field_of_study && (
            <p className="text-xs text-red-500 mt-1">
              {errors.field_of_study.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Start Date *
            </label>
            <input
              type="date"
              {...register("start_date", {
                required: "Start date is required",
              })}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
            {errors.start_date && (
              <p className="text-xs text-red-500 mt-1">
                {errors.start_date.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
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
          <label
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--sidebar-text)" }}
          >
            <input
              type="checkbox"
              {...register("current")}
              className="h-4 w-4"
            />
            Currently studying here
          </label>
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

        {/* Institution Logo */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Institution Logo
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("institution_logo")}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {initialData?.institution_logo_url && (
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Current logo: {initialData.institution_logo_url.split("/").pop()}
            </p>
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
            {isSubmitting ? "Saving..." : mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EducationFormDialog;
