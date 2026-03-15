// src/pages/categories/components/CategoryViewDialog.tsx
import React, { useState, useEffect } from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  Package,
  Tag,
  Calendar,
  Edit,
  Star,
  FileText,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Category } from "@/api/core/category";
import { Blog } from "@/api/core/blog";
import { formatDate } from "@/utils/formatters";

interface CategoryViewDialogProps {
  isOpen: boolean;
  category: Category | null;
  blogs: Blog[];
  loading: boolean;
  loadingBlogs?: boolean;
  onClose: () => void;
  onEdit?: (category: Category) => void;
  onFetchBlogs?: () => void;
  onBlogView?: (blog: Blog) => void;
}

const CategoryViewDialog: React.FC<CategoryViewDialogProps> = ({
  isOpen,
  category,
  blogs,
  loading,
  loadingBlogs = false,
  onClose,
  onEdit,
  onFetchBlogs,
  onBlogView,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "blogs">("overview");

  useEffect(() => {
    if (activeTab === "blogs" && onFetchBlogs) {
      onFetchBlogs();
    }
  }, [activeTab, onFetchBlogs]);

  if (!category && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details" size="xl">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : category ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {category.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Slug: {category.slug} • ID: {category.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    category.featured
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Star className="w-3 h-3" />
                  {category.featured ? "Featured" : "Not Featured"}
                </span>
              </div>

              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(category)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--border-color)]">
            <nav className="flex gap-4">
              {(["overview", "blogs"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-[var(--accent-blue)] text-[var(--accent-blue)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--sidebar-text)]"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "blogs" && blogs?.length > 0 && (
                    <span className="ml-2 text-xs bg-[var(--accent-blue)] text-white rounded-full px-1.5 py-0.5">
                      {blogs?.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="mt-4">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                    <Tag className="w-4 h-4 mr-1" /> Category Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-[var(--text-secondary)]">ID:</span>{" "}
                      {category.id}
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">
                        Name:
                      </span>{" "}
                      {category.name}
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">
                        Slug:
                      </span>{" "}
                      {category.slug}
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)]">
                        Featured:
                      </span>{" "}
                      {category.featured ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {category.description && (
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
                      Description
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
                      {category.description}
                    </p>
                  </div>
                )}

                <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                    <Calendar className="w-4 h-4 mr-1" /> Timeline
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">
                        Created:
                      </span>
                      <span className="font-medium text-[var(--sidebar-text)]">
                        {formatDate(category.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">
                        Updated:
                      </span>
                      <span className="font-medium text-[var(--sidebar-text)]">
                        {formatDate(category.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "blogs" && (
              <div>
                <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
                  Blogs in this Category
                </h4>
                {loadingBlogs ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]"></div>
                  </div>
                ) : blogs?.length === 0 ? (
                  <p className="text-center py-4 text-[var(--text-secondary)]">
                    No blogs found in this category.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[var(--border-color)]">
                      <thead className="bg-[var(--card-secondary-bg)]">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                            Title
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                            Slug
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                            Published
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                            Views
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)]">
                        {blogs?.map((blog) => (
                          <tr key={blog.id}>
                            <td className="px-4 py-2 text-sm text-[var(--sidebar-text)]">
                              {blog.title}
                            </td>
                            <td className="px-4 py-2 text-sm text-[var(--text-secondary)]">
                              {blog.slug}
                            </td>
                            <td className="px-4 py-2 text-sm text-[var(--sidebar-text)]">
                              {blog.published_date
                                ? formatDate(blog.published_date)
                                : "Draft"}
                            </td>
                            <td className="px-4 py-2 text-sm text-[var(--sidebar-text)]">
                              {blog.views}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <button
                                className="text-[var(--accent-blue)] hover:underline flex items-center gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBlogView?.(blog);
                                }}
                              >
                                <Eye className="w-3 h-3" /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Category not found.
        </p>
      )}
    </Modal>
  );
};

export default CategoryViewDialog;
