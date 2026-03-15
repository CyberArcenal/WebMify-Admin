// src/pages/blog/components/BlogViewDialog.tsx
import React, { useState, useEffect } from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  FileText,
  Calendar,
  Edit,
  Star,
  Eye,
  MessageSquare,
  User,
  Tag,
} from "lucide-react";
import { formatDate } from "../../../utils/formatters";
import { Link } from "react-router-dom";
import { Blog } from "@/api/core/blog";
import { Comment } from "@/api/core/comment";

interface BlogViewDialogProps {
  isOpen: boolean;
  blog: Blog | null;
  comments: Comment[];
  loading: boolean;
  loadingComments?: boolean;
  onClose: () => void;
  onEdit?: (blog: Blog) => void;
  onFetchComments?: () => void;
}

const BlogViewDialog: React.FC<BlogViewDialogProps> = ({
  isOpen,
  blog,
  comments,
  loading,
  loadingComments = false,
  onClose,
  onEdit,
  onFetchComments,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "comments">(
    "overview",
  );

  useEffect(() => {
    if (activeTab === "comments" && onFetchComments) {
      onFetchComments();
    }
  }, [activeTab, onFetchComments]);

  if (!blog && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Blog Details" size="xl">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : blog ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-blue)] text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {blog.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Slug: {blog.slug} • ID: {blog.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {blog.status_display}
                </span>
              </div>

              {blog.featured && (
                <div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                </div>
              )}
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(blog)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--border-color)]">
            <nav className="flex gap-4">
              {(["overview", "comments"] as const).map((tab) => (
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
                  {tab === "comments" && comments.length > 0 && (
                    <span className="ml-2 text-xs bg-[var(--accent-blue)] text-white rounded-full px-1.5 py-0.5">
                      {comments.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="mt-4">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  {/* Content */}
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
                      Content
                    </h4>
                    <div className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
                      {blog.content}
                    </div>
                  </div>

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                      <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
                        Excerpt
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {blog.excerpt}
                      </p>
                    </div>
                  )}

                  {/* Categories */}
                  {blog.categories && blog.categories?.length > 0 && (
                    <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                      <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                        <Tag className="w-4 h-4 mr-1" /> Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {blog.categories?.map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2 py-1 bg-[var(--card-bg)] text-[var(--text-secondary)] rounded-md text-xs"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Author */}
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                      <User className="w-4 h-4 mr-1" /> Author
                    </h4>
                    {blog.author && (
                      <div className="flex items-center gap-2">
                        {blog.author.image_url && (
                          <img
                            src={blog.author.image_url}
                            alt={blog.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-[var(--sidebar-text)]">
                            {blog.author.name}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {blog.author.bio}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                      <Eye className="w-4 h-4 mr-1" /> Statistics
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">
                          Views:
                        </span>
                        <span className="font-medium text-[var(--sidebar-text)]">
                          {blog.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
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
                          {formatDate(blog.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">
                          Updated:
                        </span>
                        <span className="font-medium text-[var(--sidebar-text)]">
                          {formatDate(blog.updated_at)}
                        </span>
                      </div>
                      {blog.published_date && (
                        <div className="flex justify-between">
                          <span className="text-[var(--text-secondary)]">
                            Published:
                          </span>
                          <span className="font-medium text-[var(--sidebar-text)]">
                            {formatDate(blog.published_date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div>
                <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
                  Comments
                </h4>
                {loadingComments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-center py-4 text-[var(--text-secondary)]">
                    No comments yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-[var(--card-secondary-bg)] p-3 rounded-md"
                      >
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-[var(--text-secondary)] mt-1" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium text-[var(--sidebar-text)]">
                                  {comment.author?.name || "Anonymous"}
                                </span>
                                <span className="text-xs text-[var(--text-secondary)] ml-2">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              {!comment.approved && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                  Pending
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                              {comment.content}
                            </p>
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-2 pl-4 border-l-2 border-[var(--border-color)]">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="mt-2">
                                    <span className="font-medium text-sm text-[var(--sidebar-text)]">
                                      {reply.author?.name || "Anonymous"}
                                    </span>
                                    <span className="text-xs text-[var(--text-secondary)] ml-2">
                                      {formatDate(reply.created_at)}
                                    </span>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                      {reply.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Blog not found.
        </p>
      )}
    </Modal>
  );
};

export default BlogViewDialog;
