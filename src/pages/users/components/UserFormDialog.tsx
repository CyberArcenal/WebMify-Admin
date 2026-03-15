// src/pages/users/components/UserFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import userAPI, { User, UserCreateData } from "@/api/core/user";

interface UserFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  userId: number | null;
  initialData: Partial<User> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_type: "viewer" | "customer" | "staff" | "manager" | "admin";
  status: "active" | "restricted" | "suspended" | "deleted";
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
};

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  isOpen,
  mode,
  userId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      user_type: "viewer",
      status: "active",
      is_active: true,
      is_staff: false,
      is_superuser: false,
    },
  });

  const password = watch("password");

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        username: initialData.username || "",
        email: initialData.email || "",
        password: "",
        confirm_password: "",
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        phone_number: initialData.phone_number || "",
        user_type: initialData.user_type || "viewer",
        status: initialData.status || "active",
        is_active: initialData.is_active ?? true,
        is_staff: initialData.is_staff ?? false,
        is_superuser: initialData.is_superuser ?? false,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "add") {
        if (data.password !== data.confirm_password) {
          throw new Error("Passwords do not match");
        }

        const payload: UserCreateData = {
          username: data.username,
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          user_type: data.user_type,
          status: data.status,
          is_active: data.is_active,
          is_staff: data.is_staff,
          is_superuser: data.is_superuser,
        };

        await userAPI.create(payload);
        dialogs.success("User created successfully");
      } else {
        if (!userId) throw new Error("User ID missing");

        // For edit, we may not include password if empty
        const payload: any = {
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          user_type: data.user_type,
          status: data.status,
          is_active: data.is_active,
          is_staff: data.is_staff,
          is_superuser: data.is_superuser,
        };
        if (data.password) {
          if (data.password !== data.confirm_password) {
            throw new Error("Passwords do not match");
          }
          payload.password = data.password;
        }

        await userAPI.patch(userId, payload);
        dialogs.success("User updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save user");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add User" : "Edit User"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Username *
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Email
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              {mode === "add" ? "Password *" : "Password (leave empty to keep current)"}
            </label>
            <input
              type="password"
              {...register("password", mode === "add" ? { required: "Password is required" } : {})}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirm_password", {
                validate: (value) => !password || value === password || "Passwords do not match",
              })}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
            {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              First Name
            </label>
            <input
              {...register("first_name")}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Last Name
            </label>
            <input
              {...register("last_name")}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Phone Number
            </label>
            <input
              {...register("phone_number")}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            />
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              User Type
            </label>
            <select
              {...register("user_type")}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            >
              <option value="viewer">Viewer</option>
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Status
            </label>
            <select
              {...register("status")}
              className="compact-input w-full border rounded-md"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
                color: "var(--sidebar-text)",
              }}
            >
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
              <input type="checkbox" {...register("is_active")} className="h-4 w-4" />
              Active
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
              <input type="checkbox" {...register("is_staff")} className="h-4 w-4" />
              Staff
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
              <input type="checkbox" {...register("is_superuser")} className="h-4 w-4" />
              Superuser
            </label>
          </div>
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

export default UserFormDialog;