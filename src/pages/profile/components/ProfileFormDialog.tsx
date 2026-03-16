// src/pages/profile/components/ProfileFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import profileAPI, { Profile, ProfileUpdateData } from "@/api/core/profile";

interface ProfileFormDialogProps {
  isOpen: boolean;
  initialData: Partial<Profile> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  address: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  resume: string;
  profile_image: FileList;
};

const ProfileFormDialog: React.FC<ProfileFormDialogProps> = ({
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
      name: "",
      title: "",
      bio: "",
      email: "",
      phone: "",
      address: "",
      github_url: "",
      linkedin_url: "",
      twitter_url: "",
      resume: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        title: initialData.title || "",
        bio: initialData.bio || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        github_url: initialData.github_url || "",
        linkedin_url: initialData.linkedin_url || "",
        twitter_url: initialData.twitter_url || "",
        resume: initialData.resume_url || "",
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    if (!initialData?.id) {
      dialogs.error("Profile ID missing");
      return;
    }

    try {
      const payload: ProfileUpdateData = {
        name: data.name,
        title: data.title,
        bio: data.bio,
        email: data.email,
        phone: data.phone || undefined,
        address: data.address || undefined,
        github_url: data.github_url || undefined,
        linkedin_url: data.linkedin_url || undefined,
        twitter_url: data.twitter_url || undefined,
        resume: data.resume || undefined,
      };

      // Handle profile image if present
      if (data.profile_image && data.profile_image.length > 0) {
        payload.profile_image = data.profile_image[0];
      }

      await profileAPI.patch(initialData.id, payload);
      dialogs.success("Profile updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to update profile");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title="Edit Profile"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Personal Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--sidebar-text)] border-b pb-1">
            Personal Information
          </h4>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Full Name *
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

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Bio
            </label>
            <textarea
              {...register("bio")}
              rows={4}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--sidebar-text)] border-b pb-1">
            Contact Information
          </h4>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Email *
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Phone
            </label>
            <input
              {...register("phone")}
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
              Address
            </label>
            <input
              {...register("address")}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--sidebar-text)] border-b pb-1">
            Social Links
          </h4>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              GitHub URL
            </label>
            <input
              {...register("github_url")}
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
              LinkedIn URL
            </label>
            <input
              {...register("linkedin_url")}
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
              Twitter URL
            </label>
            <input
              {...register("twitter_url")}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
          </div>
        </div>

        {/* Resume & Profile Image */}
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--sidebar-text)] border-b pb-1">
            Resume & Profile Image
          </h4>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Resume URL
            </label>
            <input
              {...register("resume")}
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
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("profile_image")}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
            {initialData?.profile_image_url && (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Current: {initialData.profile_image_url.split("/").pop()}
              </p>
            )}
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileFormDialog;
