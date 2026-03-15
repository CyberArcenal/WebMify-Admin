// src/pages/profile/index.tsx
import React, { useState } from "react";
import {
  Edit,
  RefreshCw,
  User,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import Button from "../../components/UI/Button";
import { dialogs } from "../../utils/dialogs";
import { showSuccess, showError } from "../../utils/notification";
import useProfile from "./hooks/useProfile";
import useProfileForm from "./hooks/useProfileForm";
import ProfileFormDialog from "./components/ProfileFormDialog";
import profileAPI from "@/api/core/profile";
import { formatDate } from "@/utils/formatters";

const ProfilePage: React.FC = () => {
  const { profile, loading, error, reload } = useProfile();
  const formDialog = useProfileForm();

  const handleEdit = () => {
    if (profile) {
      formDialog.openEdit(profile);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-4 text-[var(--text-secondary)]">
        No profile found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="compact-card rounded-md shadow-md border p-4"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: "var(--sidebar-text)" }}
            >
              My Profile
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Manage your personal information and online presence
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={reload}
              className="btn btn-secondary btn-sm rounded-md flex items-center"
            >
              <RefreshCw className="icon-sm mr-1" />
              Refresh
            </button>
            <Button
              onClick={handleEdit}
              variant="primary"
              size="sm"
              icon={Edit}
              iconPosition="left"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div
          className="compact-card rounded-md shadow-md border p-4 lg:col-span-1"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex flex-col items-center text-center">
            {profile.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-[var(--border-color)]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[var(--accent-blue)] flex items-center justify-center text-white mb-3">
                <User className="w-12 h-12" />
              </div>
            )}
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--sidebar-text)" }}
            >
              {profile.name}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {profile.title}
            </p>
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs text-[var(--accent-blue)] hover:underline"
              >
                View Resume
              </a>
            )}
            <div className="mt-3 w-full pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-[var(--sidebar-text)]">
                  {profile.status_display || profile.status}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Member since:</span>
                <span className="font-medium text-[var(--sidebar-text)]">
                  {formatDate(profile.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Bio */}
          <div
            className="compact-card rounded-md shadow-md border p-4"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Bio</h4>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
              {profile.bio || "No bio provided."}
            </p>
          </div>

          {/* Contact Information */}
          <div
            className="compact-card rounded-md shadow-md border p-4"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <h4 className="font-medium mb-3 text-[var(--sidebar-text)]">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[var(--text-secondary)]">Email:</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-[var(--accent-blue)] hover:underline"
                >
                  {profile.email}
                </a>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">Phone:</span>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-[var(--accent-blue)] hover:underline"
                  >
                    {profile.phone}
                  </a>
                </div>
              )}
              {profile.address && (
                <div className="flex items-center gap-2 text-sm md:col-span-2">
                  <MapPin className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">Address:</span>
                  <span className="text-[var(--sidebar-text)]">
                    {profile.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Location Details (from separate endpoint) */}
          {profile.location && (
            <div
              className="compact-card rounded-md shadow-md border p-4"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h4 className="font-medium mb-3 text-[var(--sidebar-text)]">
                Location & Availability
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">Address:</span>
                  <span className="text-[var(--sidebar-text)]">
                    {profile.location.address}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-secondary)]">
                    Coordinates:
                  </span>
                  <span className="text-[var(--sidebar-text)]">
                    {profile.location.coordinates}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--text-secondary)]">
                    Availability:
                  </span>
                  <span className="text-[var(--sidebar-text)]">
                    {profile.location.availability}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          {profile.socialLinks && (
            <div
              className="compact-card rounded-md shadow-md border p-4"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h4 className="font-medium mb-3 text-[var(--sidebar-text)]">
                Social Links
              </h4>
              <div className="flex flex-wrap gap-3">
                {profile.socialLinks.github_url && (
                  <a
                    href={profile.socialLinks.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {profile.socialLinks.linkedin_url && (
                  <a
                    href={profile.socialLinks.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {profile.socialLinks.twitter_url && (
                  <a
                    href={profile.socialLinks.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
                  >
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                )}
                {profile.socialLinks.instagram_url && (
                  <a
                    href={profile.socialLinks.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
                  >
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                )}
                {profile.socialLinks.facebook_url && (
                  <a
                    href={profile.socialLinks.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
                  >
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                )}
                {profile.socialLinks.youtube_url && (
                  <a
                    href={profile.socialLinks.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
                  >
                    <Youtube className="w-4 h-4" /> YouTube
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <ProfileFormDialog
        isOpen={formDialog.isOpen}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
    </div>
  );
};

export default ProfilePage;
