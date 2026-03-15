// src/pages/comments/components/CommentFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import commentAPI, { Comment, CommentCreateData } from "@/api/core/comment";

interface CommentFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  commentId: number | null;
  initialData: Partial<Comment> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  email: string;
  content: string;
  parent: string; // string for input, will convert to number or null
  blog: string;
  project: string;
  approved: boolean;
};

const CommentFormDialog: React.FC<CommentFormDialogProps> = ({
  isOpen,
  mode,
  commentId,
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
      email: "",
      content: "",
      parent: "",
      blog: "",
      project: "",
      approved: false,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.author?.name || "",
        email: initialData.author?.email || "",
        content: initialData.content || "",
        parent: initialData.parent?.toString() || "",
        blog: initialData.content_object?.type === "blog" ? initialData.content_object.id.toString() : "",
        project: initialData.content_object?.type === "project" ? initialData.content_object.id.toString() : "",
        approved: initialData.approved || false,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: CommentCreateData = {
        name: data.name || undefined,
        email: data.email || undefined,
        content: data.content,
        parent: data.parent ? parseInt(data.parent) : null,
        blog: data.blog ? parseInt(data.blog) : null,
        project: data.project ? parseInt(data.project) : null,
      };

      if (mode === "add") {
        if (!data.content) throw new Error("Content is required");
        await commentAPI.create(payload);
        dialogs.success("Comment created successfully");
      } else {
        if (!commentId) throw new Error("Comment ID missing");
        // For edit, we might also include approved status if needed
        const updatePayload: any = { ...payload };
        if (data.approved !== undefined) updatePayload.approved = data.approved;
        await commentAPI.update(commentId, updatePayload);
        dialogs.success("Comment updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save comment");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Comment" : "Edit Comment"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Author Name
          </label>
          <input
            {...register("name")}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Author Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Content *
          </label>
          <textarea
            {...register("content", { required: "Content is required" })}
            rows={4}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
        </div>

        {/* Parent */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Parent Comment ID (optional)
          </label>
          <input
            type="number"
            {...register("parent")}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>

        {/* Blog ID */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Blog ID
          </label>
          <input
            type="number"
            {...register("blog")}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          <p className="text-xs text-[var(--text-secondary)] mt-1">Leave blank if not for a blog</p>
        </div>

        {/* Project ID */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Project ID
          </label>
          <input
            type="number"
            {...register("project")}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
          <p className="text-xs text-[var(--text-secondary)] mt-1">Leave blank if not for a project</p>
        </div>

        {/* Approved Checkbox (only visible in edit mode) */}
        {mode === "edit" && (
          <div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
              <input type="checkbox" {...register("approved")} className="h-4 w-4" />
              Approved
            </label>
          </div>
        )}

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

export default CommentFormDialog;