// src/pages/categories/hooks/useCategoryView.ts
import { useState } from "react";
import { showError } from "../../../utils/notification";
import categoryAPI, { Category } from "@/api/core/category";
import blogAPI, { Blog } from "@/api/core/blog";

export const useCategoryView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
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

  const fetchBlogs = async () => {
    if (!category || blogs?.length > 0 || loadingBlogs) return;
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
    }
  };

  const close = () => {
    setIsOpen(false);
    setCategory(null);
    setBlogs([]);
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
