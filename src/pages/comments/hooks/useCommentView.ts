// src/pages/comments/hooks/useCommentView.ts
import { useState, useCallback } from "react";
import { showError } from "../../../utils/notification";
import commentAPI, { Comment } from "@/api/core/comment";

export const useCommentView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState<Comment | null>(null);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [hasFetchedReplies, setHasFetchedReplies] = useState(false);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    setHasFetchedReplies(false);
    setReplies([]);
    try {
      const data = await commentAPI.get(id);
      setComment(data);
    } catch (err: any) {
      showError(err.message || "Failed to load comment details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = useCallback(async () => {
    if (!comment || hasFetchedReplies || loadingReplies) return;

    setLoadingReplies(true);
    try {
      // API might support fetching replies via parent filter
      const response = await commentAPI.list({
        parent: comment.id,
        page_size: 50,
      });
      setReplies(response.results);
    } catch (err: any) {
      showError(err.message || "Failed to load replies");
    } finally {
      setLoadingReplies(false);
      setHasFetchedReplies(true);
    }
  }, [comment, hasFetchedReplies, loadingReplies]);

  const close = () => {
    setIsOpen(false);
    setComment(null);
    setReplies([]);
    setHasFetchedReplies(false);
  };

  return {
    isOpen,
    loading,
    comment,
    replies,
    loadingReplies,
    open,
    fetchReplies,
    close,
  };
};