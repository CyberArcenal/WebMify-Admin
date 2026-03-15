// src/pages/testimonials/components/TestimonialActionsDropdown.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Star,
  StarOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { TestimonialWithDetails } from "../hooks/useTestimonials";

interface TestimonialActionsDropdownProps {
  testimonial: TestimonialWithDetails;
  onView: (testimonial: TestimonialWithDetails) => void;
  onEdit: (testimonial: TestimonialWithDetails) => void;
  onDelete: (testimonial: TestimonialWithDetails) => void;
  onToggleFeatured?: (testimonial: TestimonialWithDetails) => void;
  onToggleApproved?: (testimonial: TestimonialWithDetails) => void;
}

const TestimonialActionsDropdown: React.FC<TestimonialActionsDropdownProps> = ({
  testimonial,
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleApproved,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDropdownPosition = () => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 200;
    const windowHeight = window.innerHeight;

    if (rect.bottom + dropdownHeight > windowHeight) {
      return {
        bottom: `${windowHeight - rect.top + 5}px`,
        right: `${window.innerWidth - rect.right}px`,
      };
    }
    return {
      top: `${rect.bottom + 5}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  };

  return (
    <div className="testimonial-actions-dropdown-container" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors relative cursor-pointer"
        title="More Actions"
      >
        <MoreVertical
          className="w-4 h-4"
          style={{ color: "var(--text-secondary)" }}
        />
      </button>

      {isOpen && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 w-48 z-50 max-h-96 overflow-y-auto"
          style={getDropdownPosition()}
        >
          <div className="py-1">
            {/* View Details */}
            <button
              onClick={() => handleAction(() => onView(testimonial))}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Eye className="w-4 h-4 text-sky-500" />
              <span>View Details</span>
            </button>

            {/* Edit */}
            <button
              onClick={() => handleAction(() => onEdit(testimonial))}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 text-yellow-500" />
              <span>Edit</span>
            </button>

            {/* Toggle Featured */}
            {testimonial.featured ? (
              <button
                onClick={() => handleAction(() => onToggleFeatured?.(testimonial))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <StarOff className="w-4 h-4 text-orange-500" />
                <span>Remove Featured</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction(() => onToggleFeatured?.(testimonial))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <Star className="w-4 h-4 text-green-500" />
                <span>Mark Featured</span>
              </button>
            )}

            {/* Toggle Approved */}
            {testimonial.approved ? (
              <button
                onClick={() => handleAction(() => onToggleApproved?.(testimonial))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <XCircle className="w-4 h-4 text-orange-500" />
                <span>Unapprove</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction(() => onToggleApproved?.(testimonial))}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Approve</span>
              </button>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 my-1"></div>

            {/* Delete */}
            <button
              onClick={() => handleAction(() => onDelete(testimonial))}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialActionsDropdown;