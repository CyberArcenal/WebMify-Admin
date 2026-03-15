// src/pages/categories/hooks/useCategoryView.ts
import { useState, useCallback } from "react";
import { showError } from "../../../utils/notification";
import categoryAPI, { Category } from "@/api/core/category";
import blogAPI, { Blog } from "@/api/core/blog";

export const useCategoryView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  // Flag to remember if we already tried to fetch blogs for this category
  const [hasFetchedBlogs, setHasFetchedBlogs] = useState(false);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    // Reset flag when opening a new category
    setHasFetchedBlogs(false);
    setBlogs([]);
    try {
      const data = await categoryAPI.get(id);
      setCategory(data);
    } catch (err: any) {
      showError(err.message || "Failed to load category details");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = useCallback(async () => {
    // Prevent fetching if already fetched, already loading, or no category
    if (hasFetchedBlogs || loadingBlogs || !category) return;

    setLoadingBlogs(true);
    try {
      const response = await blogAPI.list({
        category: category.slug,
        page_size: 50,
      });
      setBlogs(response.results);
    } catch (err: any) {
      showError(err.message || "Failed to load blogs");
    } finally {
      setLoadingBlogs(false);
      // Mark as fetched even if the result is empty
      setHasFetchedBlogs(true);
    }
  }, [category, hasFetchedBlogs, loadingBlogs]);

  const close = () => {
    setIsOpen(false);
    setCategory(null);
    setBlogs([]);
    setHasFetchedBlogs(false);
  };

  return {
    isOpen,
    loading,
    category,
    blogs,
    loadingBlogs,
    open,
    fetchBlogs,
    close,
  };
};