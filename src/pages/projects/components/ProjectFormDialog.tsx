// src/pages/projects/components/ProjectFormDialog.tsx
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import { Upload, X } from "lucide-react";
import projectAPI, { Project, ProjectCreateData } from "@/api/core/project";
import categoryAPI, { Category } from "@/api/core/category";
import CategorySelect from "@/components/Selects/Category";

interface ProjectFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  projectId: number | null;
  initialData: Partial<Project> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  title: string;
  slug: string;
  description: string;
  project_type: number | undefined;
  demo_url: string;
  source_code_url: string;
  technologies: string;
  featured: boolean;
  client: string;
  development_time: string;
  testimonial_content: string;
  testimonial_author: string;
  testimonial_author_position: string;
  challenges: string;
  solutions: string;
  sales_increase: string;
  load_time: string;
  users: string;
  test_coverage: string;
};

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  isOpen,
  mode,
  projectId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      project_type: undefined,
      demo_url: "",
      source_code_url: "",
      technologies: "",
      featured: false,
      client: "",
      development_time: "",
      testimonial_content: "",
      testimonial_author: "",
      testimonial_author_position: "",
      challenges: "",
      solutions: "",
      sales_increase: "",
      load_time: "",
      users: "",
      test_coverage: "",
    },
  });

  const title = watch("title");
  const slug = watch("slug");
  const categoryId = watch("project_type");

  // Auto-generate slug from title (only in add mode or if slug is empty)
useEffect(() => {
  if (mode === "add" && title?.trim()) {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")  
      .replace(/^-+|-+$/g, "");   

    setValue("slug", generatedSlug);
  }
}, [mode, title, setValue]);


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.list();
        setCategories(response.results);
      } catch (error) {}
    };

    loadCategories();
  }, [projectId]);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        project_type: initialData.project_type?.id || undefined,
        demo_url: initialData.demo_url || "",
        source_code_url: initialData.source_code_url || "",
        technologies: initialData.technologies_list?.join(", ") || "",
        featured: initialData.featured || false,
        client: initialData.client || "",
        development_time: initialData.development_time || "",
        testimonial_content: initialData.testimonial?.content || "",
        testimonial_author: initialData.testimonial?.author || "",
        testimonial_author_position: initialData.testimonial?.position || "",
        challenges: initialData.challenges || "",
        solutions: initialData.solutions || "",
        sales_increase: initialData.impact_stats?.sales_increase || "",
        load_time: initialData.impact_stats?.load_time || "",
        users: initialData.impact_stats?.users || "",
        test_coverage: initialData.impact_stats?.test_coverage || "",
      });
      if (initialData.image_url) {
        setImagePreview(initialData.image_url);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    } else {
      reset();
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, reset]);

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      dialogs.error("Please select a valid image file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormData) => {
    if (
      !(await dialogs.confirm({
        title: "Submit Form",
        message: "Are you sure do you want to submit thid form?.",
      }))
    )
      return;
    try {
      const payload: ProjectCreateData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        project_type: data.project_type,
        demo_url: data.demo_url || undefined,
        source_code_url: data.source_code_url || undefined,
        technologies: data.technologies,
        featured: data.featured,
        image: imageFile || undefined,
      };

      if (mode === "add") {
        if (!data.title) throw new Error("Title is required");
        if (!data.slug) throw new Error("Slug is required");
        if (!data.project_type) throw new Error("Project type is required");
        await projectAPI.create(payload);
        dialogs.success("Project created successfully");
      } else {
        if (!projectId) throw new Error("Project ID missing");
        await projectAPI.update(projectId, payload);
        dialogs.success("Project updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save project");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Project" : "Edit Project"}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Title *
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Slug
              </label>
              <input
                {...register("slug")}
                className="compact-input w-full border rounded-md"
                placeholder="auto-generated from title"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={3}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Project Type */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Project Type
              </label>
              <CategorySelect
                value={categoryId ? categoryId : null}
                onChange={(categoryId: number | null, category?: Category) => {
                  setValue("project_type", categoryId || undefined);
                }}
              />
            </div>

            {/* Technologies */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Technologies (comma separated)
              </label>
              <input
                {...register("technologies")}
                className="compact-input w-full border rounded-md"
                placeholder="React, Django, PostgreSQL"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>

            {/* Demo URL */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Demo URL
              </label>
              <input
                {...register("demo_url")}
                className="compact-input w-full border rounded-md"
                placeholder="https://..."
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>

            {/* Source Code URL */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Source Code URL
              </label>
              <input
                {...register("source_code_url")}
                className="compact-input w-full border rounded-md"
                placeholder="https://..."
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Featured Image */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Featured Image
              </label>
              <div
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-[var(--card-hover-bg)] transition-colors"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--card-secondary-bg)",
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (
                          !(await dialogs.confirm({
                            title: "Remove Featured Image",
                            icon: "warning",
                            message:
                              "Are you sure do you want to remove this image?.",
                          }))
                        )
                          return;

                        removeImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload
                      className="w-8 h-8"
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Drag & drop an image here, or click to select
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
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

            {/* Client */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Client
              </label>
              <input
                {...register("client")}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>

            {/* Development Time */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Development Time
              </label>
              <input
                {...register("development_time")}
                className="compact-input w-full border rounded-md"
                placeholder="e.g., 3 months"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>

            {/* Impact Stats (simple inputs) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--sidebar-text)" }}
                >
                  Sales Increase
                </label>
                <input
                  {...register("sales_increase")}
                  className="compact-input w-full border rounded-md"
                  placeholder="e.g., 30%"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    color: "var(--sidebar-text)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--sidebar-text)" }}
                >
                  Load Time
                </label>
                <input
                  {...register("load_time")}
                  className="compact-input w-full border rounded-md"
                  placeholder="e.g., 1.2s"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    color: "var(--sidebar-text)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--sidebar-text)" }}
                >
                  Users
                </label>
                <input
                  {...register("users")}
                  className="compact-input w-full border rounded-md"
                  placeholder="e.g., 10k"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    color: "var(--sidebar-text)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--sidebar-text)" }}
                >
                  Test Coverage
                </label>
                <input
                  {...register("test_coverage")}
                  className="compact-input w-full border rounded-md"
                  placeholder="e.g., 85%"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    color: "var(--sidebar-text)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="border-t border-[var(--border-color)] pt-4">
          <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
            Testimonial (Optional)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Content
              </label>
              <textarea
                {...register("testimonial_content")}
                rows={2}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Author
              </label>
              <input
                {...register("testimonial_author")}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
              <label
                className="block text-sm font-medium mt-2 mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Position
              </label>
              <input
                {...register("testimonial_author_position")}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Challenges & Solutions */}
        <div className="border-t border-[var(--border-color)] pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Challenges
              </label>
              <textarea
                {...register("challenges")}
                rows={2}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Solutions
              </label>
              <textarea
                {...register("solutions")}
                rows={2}
                className="compact-input w-full border rounded-md"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--sidebar-text)",
                }}
              />
            </div>
          </div>
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

export default ProjectFormDialog;
