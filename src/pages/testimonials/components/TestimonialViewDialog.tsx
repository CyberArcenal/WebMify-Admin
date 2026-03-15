// src/pages/testimonials/components/TestimonialViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  User,
  Edit,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  StarOff,
} from "lucide-react";
import { Testimonial } from "@/api/core/testimonial";
import { formatDate } from "@/utils/formatters";

interface TestimonialViewDialogProps {
  isOpen: boolean;
  testimonial: Testimonial | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (testimonial: Testimonial) => void;
  onToggleFeatured?: (testimonial: Testimonial) => void;
  onToggleApproved?: (testimonial: Testimonial) => void;
}

const TestimonialViewDialog: React.FC<TestimonialViewDialogProps> = ({
  isOpen,
  testimonial,
  loading,
  onClose,
  onEdit,
  onToggleFeatured,
  onToggleApproved,
}) => {
  if (!testimonial && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Testimonial Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : testimonial ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {testimonial.author_image_url ? (
                <img
                  src={testimonial.author_image_url}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--accent-blue)] text-white">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {testimonial.author}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {testimonial.author_title} • ID: {testimonial.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {onToggleFeatured && (
                <Button
                  variant={testimonial.featured ? "warning" : "success"}
                  size="sm"
                  onClick={() => onToggleFeatured(testimonial)}
                >
                  <Star className="w-4 h-4 mr-1" />
                  {testimonial.featured ? "Unfeature" : "Feature"}
                </Button>
              )}
              {onToggleApproved && (
                <Button
                  variant={testimonial.approved ? "warning" : "success"}
                  size="sm"
                  onClick={() => onToggleApproved(testimonial)}
                >
                  {testimonial.approved ? "Unapprove" : "Approve"}
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(testimonial)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Star className="w-4 h-4 mr-1" /> Rating
            </h4>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= testimonial.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-[var(--sidebar-text)]">
                {testimonial.rating} out of 5
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">
              Testimonial
            </h4>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line italic">
              "{testimonial.content}"
            </p>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Featured</h4>
              <div className="flex items-center gap-2">
                {testimonial.featured ? (
                  <>
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-yellow-700">Featured</span>
                  </>
                ) : (
                  <>
                    <StarOff className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Not Featured</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
              <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Approved</h4>
              <div className="flex items-center gap-2">
                {testimonial.approved ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-700">Approved</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">Pending</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
            <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
              <Calendar className="w-4 h-4 mr-1" /> Created
            </h4>
            <p className="text-sm text-[var(--sidebar-text)]">
              {formatDate(testimonial.created_at)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">
          Testimonial not found.
        </p>
      )}
    </Modal>
  );
};

export default TestimonialViewDialog;