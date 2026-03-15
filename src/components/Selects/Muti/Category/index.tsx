// src/components/Selects/CategoryMultiSelect/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Tag, X, Star } from "lucide-react";
import categoryAPI, { Category } from "@/api/core/category";

interface CategoryMultiSelectProps {
  value: number[];
  onChange: (categoryIds: number[], categories?: Category[]) => void;
  disabled?: boolean;
  placeholder?: string;
  showFeaturedOnly?: boolean;
  className?: string;
  maxHeight?: string;
}

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select categories...",
  showFeaturedOnly = false,
  className = "w-full max-w-md",
  maxHeight = "350px",
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const params: any = {
          page_size: 100,
          sortBy: "name",
          sortOrder: "asc",
        };
        if (showFeaturedOnly) params.featured = true;

        const response = await categoryAPI.list(params);
        setCategories(response.results);
        setFilteredCategories(response.results);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [showFeaturedOnly]);

  // Filter categories by search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredCategories(
      categories.filter((cat) => cat.name.toLowerCase().includes(lower))
    );
  }, [searchTerm, categories]);

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

  const toggleCategory = (category: Category) => {
    let newIds: number[];
    let newCategories: Category[];
    if (value.includes(category.id)) {
      newIds = value.filter(id => id !== category.id);
      newCategories = categories.filter(c => newIds.includes(c.id));
    } else {
      newIds = [...value, category.id];
      newCategories = [...categories.filter(c => value.includes(c.id)), category];
    }
    onChange(newIds, newCategories);
  };

  const removeCategory = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newIds = value.filter(id => id !== categoryId);
    const newCategories = categories.filter(c => newIds.includes(c.id));
    onChange(newIds, newCategories);
  };

  const selectedCategories = categories.filter(c => value.includes(c.id));

  return (
    <div className={`relative ${className}`}>
      {/* Trigger area */}
      <div
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 rounded-lg border flex flex-wrap items-center gap-2 min-h-[42px] cursor-pointer
          transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--card-hover-bg)]"}
        `}
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      >
        <Tag className="w-4 h-4 flex-shrink-0" style={{ color: "var(--primary-color)" }} />
        {selectedCategories.length > 0 ? (
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedCategories.map(cat => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor: "var(--card-secondary-bg)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {cat.name}
                {!disabled && (
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={(e) => removeCategory(cat.id, e)}
                  />
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="truncate text-sm" style={{ color: "var(--text-secondary)" }}>
            {placeholder}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "var(--text-secondary)" }}
        />
      </div>

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
              maxHeight: maxHeight,
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
                  placeholder="Search categories..."
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

            {/* Category list */}
            <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
              {loading && categories.length === 0 ? (
                <div
                  className="p-3 text-center text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Loading...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div
                  className="p-3 text-center text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No categories found
                </div>
              ) : (
                filteredCategories.map((category) => {
                  const isSelected = value.includes(category.id);
                  return (
                    <div
                      key={category.id}
                      onClick={() => toggleCategory(category)}
                      className={`
                        w-full px-3 py-2 flex items-start gap-2 cursor-pointer
                        transition-colors text-sm hover:bg-[var(--card-hover-bg)]
                        ${isSelected ? "bg-[var(--accent-blue-light)]" : ""}
                      `}
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by div click
                        className="mt-1 flex-shrink-0"
                        style={{ accentColor: "var(--primary-color)" }}
                      />
                      <Tag
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: "var(--primary-color)" }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {category.name}
                          </span>
                          {category.featured && (
                            <Star
                              className="w-3 h-3 text-yellow-500 flex-shrink-0"
                            />
                          )}
                        </div>
                        {category.description && (
                          <div
                            className="text-xs truncate mt-0.5"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CategoryMultiSelect;