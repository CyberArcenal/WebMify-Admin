// src/pages/stats/components/StatsFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import { Stats } from "@/api/core/stats";

interface StatsFormDialogProps {
  isOpen: boolean;
  initialData: Stats | null;
  onClose: () => void;
  onSuccess: (data: Partial<Stats>) => Promise<void>;
}

type FormData = {
  projects_completed: number;
  client_satisfaction: number;
  years_experience: number;
  happy_clients: number;
};

const StatsFormDialog: React.FC<StatsFormDialogProps> = ({
  isOpen,
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
      projects_completed: 0,
      client_satisfaction: 0,
      years_experience: 0,
      happy_clients: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        projects_completed: initialData.projects_completed || 0,
        client_satisfaction: initialData.client_satisfaction || 0,
        years_experience: initialData.years_experience || 0,
        happy_clients: initialData.happy_clients || 0,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // Validate
      if (data.client_satisfaction < 0 || data.client_satisfaction > 100) {
        throw new Error("Client satisfaction must be between 0 and 100");
      }
      if (data.projects_completed < 0)
        throw new Error("Projects completed must be non-negative");
      if (data.years_experience < 0)
        throw new Error("Years experience must be non-negative");
      if (data.happy_clients < 0)
        throw new Error("Happy clients must be non-negative");

      await onSuccess(data);
    } catch (err: any) {
      dialogs.error(err.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={initialData ? "Edit Statistics" : "Create Statistics"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Projects Completed */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Projects Completed *
          </label>
          <input
            type="number"
            min="0"
            step="1"
            {...register("projects_completed", {
              required: "Required",
              valueAsNumber: true,
              min: { value: 0, message: "Must be non-negative" },
            })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.projects_completed && (
            <p className="text-xs text-red-500 mt-1">
              {errors.projects_completed.message}
            </p>
          )}
        </div>

        {/* Client Satisfaction */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Client Satisfaction (%) *
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            {...register("client_satisfaction", {
              required: "Required",
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
          {errors.client_satisfaction && (
            <p className="text-xs text-red-500 mt-1">
              {errors.client_satisfaction.message}
            </p>
          )}
        </div>

        {/* Years Experience */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Years Experience *
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            {...register("years_experience", {
              required: "Required",
              valueAsNumber: true,
              min: { value: 0, message: "Must be non-negative" },
            })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.years_experience && (
            <p className="text-xs text-red-500 mt-1">
              {errors.years_experience.message}
            </p>
          )}
        </div>

        {/* Happy Clients */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Happy Clients *
          </label>
          <input
            type="number"
            min="0"
            step="1"
            {...register("happy_clients", {
              required: "Required",
              valueAsNumber: true,
              min: { value: 0, message: "Must be non-negative" },
            })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.happy_clients && (
            <p className="text-xs text-red-500 mt-1">
              {errors.happy_clients.message}
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
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StatsFormDialog;
