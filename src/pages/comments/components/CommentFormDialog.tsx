import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import ProjectSelect from "../../../components/Selects/Project";
import BlogSelect from "../../../components/Selects/Blog";
import CommentSelect from "../../../components/Selects/Comment";
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
  parent: number | null;
  blog: number | null;
  project: number | null;
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      content: "",
      parent: null,
      blog: null,
      project: null,
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
        parent: initialData.parent || null,
        blog:
          initialData.content_object?.type === "blog"
            ? initialData.content_object.id
            : null,
        project:
          initialData.content_object?.type === "project"
            ? initialData.content_object.id
            : null,
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
        parent: data.parent, // already number or null
        blog: data.blog,
        project: data.project,
      };

      if (mode === "add") {
        if (!data.content) throw new Error("Content is required");
        await commentAPI.create(payload);
        dialogs.success("Comment created successfully");
      } else {
        if (!commentId) throw new Error("Comment ID missing");
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
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
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
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
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
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
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
          {errors.content && (
            <p className="text-xs text-red-500 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Parent Comment */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Parent Comment
          </label>
          <Controller
            name="parent"
            control={control}
            render={({ field }) => (
              <CommentSelect
                value={field.value}
                onChange={(id) => field.onChange(id)}
                placeholder="Select a parent comment (optional)"
                // Optionally filter by content type if blog/project already chosen
                // contentType={...} // could be derived from watched blog/project
              />
            )}
          />
        </div>

        {/* Blog */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Blog
          </label>
          <Controller
            name="blog"
            control={control}
            render={({ field }) => (
              <BlogSelect
                value={field.value}
                onChange={(id) => field.onChange(id)}
                placeholder="Select a blog (optional)"
              />
            )}
          />
        </div>

        {/* Project */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Project
          </label>
          <Controller
            name="project"
            control={control}
            render={({ field }) => (
              <ProjectSelect
                value={field.value}
                onChange={(id) => field.onChange(id)}
                placeholder="Select a project (optional)"
              />
            )}
          />
        </div>

        {/* Approved Checkbox (only in edit mode) */}
        {mode === "edit" && (
          <div>
            <label
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--sidebar-text)" }}
            >
              <input
                type="checkbox"
                {...register("approved")}
                className="h-4 w-4"
              />
              Approved
            </label>
          </div>
        )}

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

export default CommentFormDialog;
