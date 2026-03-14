// src/pages/blog/hooks/useBlogView.ts
import { useState } from 'react';
import { showError } from '../../../utils/notification';
import blogAPI, { Blog } from '@/api/core/blog';
import commentAPI from '@/api/core/comment';
import { Comment } from '@/api/core/comment';

export const useBlogView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await blogAPI.get(id);
      setBlog(data);
    } catch (err: any) {
      showError(err.message || 'Failed to load blog details');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!blog || comments.length > 0 || loadingComments) return;
    setLoadingComments(true);
    try {
      const response = await commentAPI.list({ content_type: 'blog', object_id: blog.id, page_size: 50 });
      setComments(response.results);
    } catch (err: any) {
      showError(err.message || 'Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setBlog(null);
    setComments([]);
  };

  return {
    isOpen,
    loading,
    blog,
    comments,
    loadingComments,
    open,
    fetchComments,
    close,
  };
};