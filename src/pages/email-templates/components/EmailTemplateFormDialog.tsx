// src/pages/email-templates/components/EmailTemplateFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import emailTemplateAPI, {
  EmailTemplate,
  EmailTemplateCreateData,
} from "@/api/core/email_template";

interface EmailTemplateFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  templateId: number | null;
  initialData: Partial<EmailTemplate> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  subject: string;
  content: string;
};

const EmailTemplateFormDialog: React.FC<EmailTemplateFormDialogProps> = ({
  isOpen,
  mode,
  templateId,
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
      subject: "",
      content: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        subject: initialData.subject || "",
        content: initialData.content || "",
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: EmailTemplateCreateData = {
        name: data.name,
        subject: data.subject,
        content: data.content,
      };

      if (mode === "add") {
        if (!data.name || !data.subject || !data.content) {
          throw new Error("All fields are required");
        }
        await emailTemplateAPI.create(payload);
        dialogs.success("Email template created successfully");
      } else {
        if (!templateId) throw new Error("Template ID missing");
        await emailTemplateAPI.update(templateId, payload);
        dialogs.success("Email template updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save email template");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Email Template" : "Edit Email Template"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Template Name *
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

        {/* Subject */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Subject *
          </label>
          <input
            {...register("subject", { required: "Subject is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.subject && (
            <p className="text-xs text-red-500 mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Content *
          </label>
          <textarea
            {...register("content", { required: "Content is required" })}
            rows={8}
            className="compact-input w-full border rounded-md font-mono"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.content && (
            <p className="text-xs text-red-500 mt-1">
              {errors.content.message}
            </p>
          )}
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            You can use variables like {"{{name}}"}, {"{{email}}"} etc.
          </p>
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

export default EmailTemplateFormDialog;
