// src/pages/profile/hooks/useProfile.ts
import profileAPI, { Profile } from "@/api/core/profile";
import { useState, useEffect, useCallback } from "react";

export interface ProfileWithExtras extends Profile {
  location?: {
    email: string;
    phone: string;
    address: string;
    coordinates: string;
    availability: string;
  };
  socialLinks?: {
    github_url: string;
    linkedin_url: string;
    twitter_url: string;
    instagram_url: string;
    facebook_url: string;
    youtube_url: string;
  };
}

interface UseProfileReturn {
  profile: ProfileWithExtras | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<ProfileWithExtras | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, locationData, socialLinksData] = await Promise.all([
        profileAPI.get(),
        profileAPI.getLocation(),
        profileAPI.getSocialLinks(),
      ]);
      setProfile({
        ...profileData,
        location: locationData,
        socialLinks: socialLinksData,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
      console.error("Profile loading error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    reload: fetchProfile,
  };
};

export default useProfile;