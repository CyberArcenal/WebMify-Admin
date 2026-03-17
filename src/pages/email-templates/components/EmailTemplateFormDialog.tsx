// src/pages/email-templates/components/EmailTemplateFormDialog.tsx
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { dialogs } from "../../../utils/dialogs";
import emailTemplateAPI, {
  EmailTemplate,
  EmailTemplateCreateData,
} from "@/api/core/email_template";

// ----------------------------------------------------------------------
// Metadata variables na available sa bawat template type
// (kinuha mula sa Django signals at state transition services)
// ----------------------------------------------------------------------
const TEMPLATE_VARIABLES: Record<string, string[]> = {
  // Blog
  blog_published: [
    "blog_title",
    "blog_slug",
    "blog_excerpt",
    "blog_url",
    "subscriber_email",
    "blog_author",
  ],

  // Comment
  comment_approved: [
    "commenter_name",
    "comment_content",
    "comment_created_at",
    "target_type",
    "blog_title",
    "blog_slug",
    "project_title",
    "project_id",
    "target_url",
  ],

  // Education
  education_current: [
    "education_institution",
    "education_degree",
    "education_field",
    "education_start",
    "education_end",
    "education_current",
  ],

  // Experience
  experience_current: [
    "experience_company",
    "experience_position",
    "experience_description",
    "experience_start",
    "experience_end",
    "experience_current",
  ],

  // Profile
  profile_status_changed: [
    "profile_name",
    "profile_title",
    "profile_email",
    "old_status",
    "new_status",
    "updated_at",
  ],

  // Project
  project_featured: [
    "project_title",
    "project_slug",
    "project_description",
    "project_type",
    "project_url",
    "featured",
    "updated_at",
  ],

  // Skill
  skill_featured: [
    "skill_name",
    "skill_category",
    "skill_proficiency",
    "skill_icon",
    "skill_featured",
  ],
  skill_proficiency_updated: [
    "skill_name",
    "skill_category",
    "old_proficiency",
    "new_proficiency",
    "skill_icon",
    "updated_at",
  ],

  // Stats
  stats_milestone: [
    "stats_projects_completed",
    "stats_client_satisfaction",
    "stats_years_experience",
    "stats_happy_clients",
    "milestone_field",
    "old_value",
    "new_value",
    "updated_at",
  ],

  // Subscriber
  subscription_deactivated: [
    "subscriber_email",
    "subscriber_confirmed",
    "subscriber_subscribed_at",
    "unsubscribe_token",
  ],
  subscription_welcome: [
    "subscriber_email",
    "subscriber_name",
    "subscriber_subscribed_at",
  ],

  // Testimonial
  testimonial_featured: [
    "testimonial_author",
    "testimonial_author_title",
    "testimonial_content",
    "testimonial_rating",
    "testimonial_featured",
  ],
  testimonial_approved: [
    "testimonial_author",
    "testimonial_author_title",
    "testimonial_content",
    "testimonial_rating",
    "testimonial_created_at",
  ],
  testimonial_media_updated: [
    "testimonial_author",
    "testimonial_author_title",
    "testimonial_image_url",
    "updated_at",
  ],

  // User
  user_welcome: ["user_username", "user_email", "user_type", "created_at"],
  user_suspended: [
    "user_username",
    "user_email",
    "old_status",
    "new_status",
    "updated_at",
  ],
  user_type_changed: [
    "user_username",
    "user_email",
    "old_user_type",
    "new_user_type",
    "updated_at",
  ],
  user_activation_status: [
    "user_username",
    "user_email",
    "is_active",
    "updated_at",
  ],
  user_staff_status: ["user_username", "user_email", "is_staff", "updated_at"],
  user_superuser_status: [
    "user_username",
    "user_email",
    "is_superuser",
    "updated_at",
  ],

  // Support Ticket (ginagamit sa comment at contact_message)
  support_ticket: [
    "contact_name",
    "contact_email",
    "contact_subject",
    "contact_message",
    "submitted_at",
    "ip_address",
    "commenter_name",
    "comment_content",
    "blog_id",
    "project_id",
    "target_type",
    "target_url",
  ],

  // Subscription confirmation (mula sa subscriber signal)
  subscription_confirmation: [
    "subscriber_name",
    "subscriber_email",
    "confirmation_url",
    "unsubscribe_url",
    "subscriber_subscribed_at",
  ],

  // Testimonial submission (kapag may bagong testimonial)
  testimonial_submission: [
    "testimonial_author",
    "testimonial_author_title",
    "testimonial_content",
    "testimonial_rating",
    "testimonial_created_at",
    "testimonial_featured",
    "testimonial_approved",
  ],

  // Generic / fallback
  custom: [], // walang predefined variables
};

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      subject: "",
      content: "",
    },
  });

  // Watch the selected template name para makuha ang available variables
  const selectedType = useWatch({ control, name: "name" });

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

  // Kunin ang listahan ng variables para sa napiling type
  const availableVariables = selectedType
    ? TEMPLATE_VARIABLES[selectedType] || []
    : [];

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Add Email Template" : "Edit Email Template"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Template Name (Type) */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Template Name *
          </label>
          <select
            {...register("name", { required: "Template name is required" })}
            className="compact-input w-full border rounded-md"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          >
            <option value="">-- Select Template --</option>
            <option value="account_activation">Account Activation</option>
            <option value="account_deactivation">Account Deactivation</option>
            <option value="announcement">General Announcement</option>
            <option value="blog_published">Blog Published</option>
            <option value="cart_abandonment">Cart Abandonment Reminder</option>
            <option value="comment_approved">Comment Approved</option>
            <option value="contact_message">Contact Message</option>
            <option value="custom">Custom Message</option>
            <option value="device_added">New Device Added to Account</option>
            <option value="education_current">Education Current</option>
            <option value="event_invitation">Event Invitation</option>
            <option value="event_reminder">Event Reminder</option>
            <option value="experience_current">Experience Current</option>
            <option value="feedback_request">Feedback / Survey Request</option>
            <option value="invoice">Invoice / Billing Notice</option>
            <option value="login_alert">New Login Alert</option>
            <option value="maintenance_notice">System Maintenance Notice</option>
            <option value="newsletter">Newsletter</option>
            <option value="order_cancelled">Order Cancelled</option>
            <option value="order_confirmation">Order Confirmation</option>
            <option value="order_delivered">Order Delivered</option>
            <option value="order_refunded">Order Refund Processed</option>
            <option value="order_returned">Order Returned / Exchange Update</option>
            <option value="order_shipped">Order Shipped</option>
            <option value="partnership_offer">Partnership / Collaboration Offer</option>
            <option value="password_reset">Password Reset</option>
            <option value="payment_failed">Payment Failed</option>
            <option value="payment_success">Payment Success</option>
            <option value="product_back_in_stock">Back in Stock Notification</option>
            <option value="product_discount">Discount / Promo Offer</option>
            <option value="product_download_link">Digital Product Download Link</option>
            <option value="product_launch">New Product Launch</option>
            <option value="product_license_key">License Key Delivery</option>
            <option value="product_preorder">Product Pre-Order Confirmation</option>
            <option value="product_recommendation">Personalized Product Recommendation</option>
            <option value="product_release_note">Release Notes / Changelog</option>
            <option value="product_review_request">Request for Product Review</option>
            <option value="product_trial_expired">Trial Expired Notification</option>
            <option value="product_update">Product Update / New Version</option>
            <option value="profile_status_changed">Profile Status Changed</option>
            <option value="profile_update">Profile Update Notification</option>
            <option value="project_featured">Project Featured</option>
            <option value="security_alert">Security Alert</option>
            <option value="skill_featured">Skill Featured</option>
            <option value="skill_proficiency_updated">Skill Proficiency Updated</option>
            <option value="stats_milestone">Stats Milestone</option>
            <option value="subscription_confirmation">Subscription Confirmation</option>
            <option value="subscription_deactivated">Subscription Deactivated</option>
            <option value="subscription_expired">Subscription Expired Notification</option>
            <option value="subscription_renewal">Subscription Renewal Reminder</option>
            <option value="subscription_trial_end">Trial Ending Reminder</option>
            <option value="subscription_trial_start">Trial Started Notification</option>
            <option value="subscription_upgrade">Subscription Upgrade Confirmation</option>
            <option value="subscription_downgrade">Subscription Downgrade Notification</option>
            <option value="subscription_welcome">Subscription Welcome</option>
            <option value="support_ticket">Support Ticket Update</option>
            <option value="system_alert">System Alert</option>
            <option value="testimonial_approved">Testimonial Approved</option>
            <option value="testimonial_featured">Testimonial Featured</option>
            <option value="testimonial_media_updated">Testimonial Media Updated</option>
            <option value="testimonial_submission">Testimonial Submission</option>
            <option value="two_factor_disabled">Two-Factor Authentication Disabled</option>
            <option value="two_factor_enabled">Two-Factor Authentication Enabled</option>
            <option value="unsubscribe">Unsubscribe Confirmation</option>
            <option value="user_activation_status">User Activation Status</option>
            <option value="user_staff_status">User Staff Status</option>
            <option value="user_superuser_status">User Superuser Status</option>
            <option value="user_suspended">User Suspended</option>
            <option value="user_type_changed">User Type Changed</option>
            <option value="user_welcome">User Welcome</option>
            <option value="welcome">Welcome Email</option>
            <option value="wishlist_reminder">Wishlist Reminder</option>
          </select>
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
          {/* Display available variables for the selected template */}
          {selectedType && availableVariables.length > 0 && (
            <div className="mt-2 p-2 rounded border border-[var(--border-color)] bg-[var(--card-bg)]">
              <p className="text-xs font-medium mb-1 text-[var(--text-secondary)]">
                Available variables for this template:
              </p>
              <div className="flex flex-wrap gap-2">
                {availableVariables.map((varName) => (
                  <code
                    key={varName}
                    className="text-xs px-1.5 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary-dark)]"
                  >
                    {`{{ ${varName} }}`}
                  </code>
                ))}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Use these variable names inside double curly braces, e.g.{" "}
                <code>{`{{ blog_title }}`}</code>
              </p>
            </div>
          )}
          {selectedType && availableVariables.length === 0 && (
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              No predefined variables for this template type. You can use
              custom metadata.
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

export default EmailTemplateFormDialog;