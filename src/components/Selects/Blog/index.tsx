// src/components/Selects/Blog/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, FileText, X, Star } from "lucide-react";
import blogAPI, { Blog } from "@/api/core/blog";

interface BlogSelectProps {
  value: number | null;
  onChange: (blogId: number | null, blog?: Blog) => void;
  disabled?: boolean;
  placeholder?: string;
  showFeaturedOnly?: boolean;
  status?: "draft" | "published";
  className?: string;
}

const BlogSelect: React.FC<BlogSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select a blog...",
  showFeaturedOnly = false,
  status,
  className = "w-full max-w-md",
}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load blogs
  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const params: any = {
          page_size: 100,
        };
        if (showFeaturedOnly) params.featured = true;
        if (status) params.status = status;

        const response = await blogAPI.list(params);
        setBlogs(response.results);
        setFilteredBlogs(response.results);
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, [showFeaturedOnly, status]);

  // Filter blogs by search term (title)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBlogs(blogs);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredBlogs(
      blogs.filter((blog) => blog.title.toLowerCase().includes(lower))
    );
  }, [searchTerm, blogs]);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Update dropdown position
  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (blog: Blog) => {
    onChange(blog.id, blog);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const selectedBlog = blogs.find((b) => b.id === value);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-lg text-left flex items-center gap-2
          transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--card-hover-bg)]"}
        `}
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
          minHeight: "42px",
        }}
      >
        <FileText
          className="w-4 h-4 flex-shrink-0"
          style={{ color: "var(--primary-color)" }}
        />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selectedBlog ? (
            <>
              <span className="font-medium truncate">{selectedBlog.title}</span>
              {selectedBlog.featured && (
                <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
              )}
              {selectedBlog.status !== "published" && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: "var(--accent-orange-light)",
                    color: "var(--accent-orange)",
                  }}
                >
                  Draft
                </span>
              )}
            </>
          ) : (
            <span
              className="truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {placeholder}
            </span>
          )}
        </div>
        {selectedBlog && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-[var(--card-hover-bg)] transition-colors flex-shrink-0"
            style={{ color: "var(--text-secondary)" }}
            title="Remove selected"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "var(--text-secondary)" }}
        />
      </button>

      {/* Portal dropdown */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] rounded-lg shadow-lg overflow-hidden"
            style={{
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              width: dropdownStyle.width,
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              maxHeight: "350px",
            }}
          >
            {/* Search bar */}
            <div
              className="p-2 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-secondary)" }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search blogs by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded text-sm"
                  style={{
                    backgroundColor: "var(--card-secondary-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Blog list */}
            <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
              {loading && blogs.length === 0 ? (
                <div
                  className="p-3 text-center text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Loading...
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div
                  className="p-3 text-center text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No blogs found
                </div>
              ) : (
                filteredBlogs.map((blog) => (
                  <button
                    key={blog.id}
                    type="button"
                    onClick={() => handleSelect(blog)}
                    className={`
                      w-full px-3 py-2 text-left flex items-start gap-2
                      transition-colors text-sm cursor-pointer hover:bg-[var(--card-hover-bg)]
                      ${blog.id === value ? "bg-[var(--accent-blue-light)]" : ""}
                    `}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <FileText
                      className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {blog.title}
                        </span>
                        {blog.featured && (
                          <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                        )}
                        {blog.status !== "published" && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: "var(--accent-orange-light)",
                              color: "var(--accent-orange)",
                            }}
                          >
                            Draft
                          </span>
                        )}
                      </div>
                      {blog.excerpt && (
                        <div
                          className="text-xs truncate mt-0.5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {blog.excerpt}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default BlogSelect;