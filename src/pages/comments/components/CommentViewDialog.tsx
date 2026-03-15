// src/pages/comments/components/CommentViewDialog.tsx
import React, { useState, useEffect } from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  User,
  Calendar,
  Edit,
  MessageSquare,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Comment } from "@/api/core/comment";
import { formatDate } from "@/utils/formatters";

interface CommentViewDialogProps {
  isOpen: boolean;
  comment: Comment | null;
  replies: Comment[];
  loading: boolean;
  loadingReplies?: boolean;
  onClose: () => void;
  onEdit?: (comment: Comment) => void;
  onFetchReplies?: () => void;
  onToggleApproved?: (comment: Comment) => void;
}

const CommentViewDialog: React.FC<CommentViewDialogProps> = ({
  isOpen,
  comment,
  replies,
  loading,
  loadingReplies = false,
  onClose,
  onEdit,
  onFetchReplies,
  onToggleApproved,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "replies">("details");

  useEffect(() => {
    if (activeTab === "replies" && onFetchReplies) {
      onFetchReplies();
    }
  }, [activeTab, onFetchReplies]);

  if (!comment && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comment Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : comment ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--accent-blue)] text-white">
                {comment.author?.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {comment.author?.name || "Anonymous"}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {comment.author?.email && `${comment.author.email} • `}
                  ID: {comment.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    comment.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {comment.approved ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Approved
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      Pending
                    </>
                  )}
                </span>
              </div>

              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(comment)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
              {onToggleApproved && (
                <Button
                  variant={comment.approved ? "warning" : "success"}
                  size="sm"
                  onClick={() => onToggleApproved(comment)}
                >
                  {comment.approved ? "Unapprove" : "Approve"}
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--border-color)]">
            <nav className="flex gap-4">
              {(["details", "replies"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-[var(--accent-blue)] text-[var(--accent-blue)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--sidebar-text)]"
                  }`}
                >
                  {tab === "details" ? "Details" : "Replies"}
                  {tab === "replies" && replies?.length > 0 && (
                    <span className="ml-2 text-xs bg-[var(--accent-blue)] text-white rounded-full px-1.5 py-0.5">
                      {replies?.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="mt-4">
            {activeTab === "details" && (
              <div className="grid grid-cols-1 gap-4">
                {/* Comment Content */}
                <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                    <MessageSquare className="w-4 h-4 mr-1" /> Comment
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>

                {/* Related To */}
                {comment.content_object && (
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
                      Related To
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {comment.content_object.type}: {comment.content_object.title} (ID: {comment.content_object.id})
                    </p>
                    <a
                      href={comment.content_object.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--accent-blue)] hover:underline"
                    >
                      View original
                    </a>
                  </div>
                )}

                {/* Parent Info */}
                {comment.parent && (
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
                      Parent Comment ID
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {comment.parent}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
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
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">
                        Display:
                      </span>
                      <span className="font-medium text-[var(--sidebar-text)]">
                        {comment.created_at_display}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "replies" && (
              <div>
                <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
                  Replies
                </h4>
                {loadingReplies ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]"></div>
                  </div>
                ) : replies?.length === 0 ? (
                  <p className="text-center py-4 text-[var(--text-secondary)]">
                    No replies to this comment.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {replies?.map((reply) => (
                      <div
                        key={reply.id}
                        className="bg-[var(--card-secondary-bg)] p-3 rounded-md border border-[var(--border-color)]"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-medium text-[var(--sidebar-text)]">
                            {reply.author?.name || "Anonymous"}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {formatDate(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {reply.content}
                        </p>
                        {!reply.approved && (
                          <span className="inline-block mt-1 text-xs text-yellow-600">
                            Pending approval
                          </span>
                        )}
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
          Comment not found.
        </p>
      )}
    </Modal>
  );
};

export default CommentViewDialog;