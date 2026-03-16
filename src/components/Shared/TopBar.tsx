import notificationAPI from "@/api/core/notification";
import {
  BarChart3,
  Bell,
  Menu,
  Search,
  FileText,
  Folder,
  MessageSquare,
  Briefcase,
  User,
  Code,
  GraduationCap,
  Star,
  Mail,
  Users,
  PieChart,
  MailOpen,
  Settings,
  Award,
  Image,
  Layers,
  Cpu,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationDrawer } from "./NotificationDrawer";

interface RouteInfo {
  path: string;
  name: string;
  category: string;
}

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count on mount and when drawer closes
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.list({ page: 1, page_size: 100 });
      const unread = response.results.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  const handleDrawerClose = () => {
    setIsNotificationOpen(false);
    fetchUnreadCount();
  };

  const handleUnreadCountChange = (count: number) => {
    setUnreadCount(count);
  };

  // All searchable routes – matches the ones in App.tsx
  const allRoutes: RouteInfo[] = useMemo(
    () => [
      // Dashboard
      { path: "/dashboard", name: "Dashboard", category: "Main" },

      // Blog
      { path: "/blog", name: "Blog Posts", category: "Blog" },
      { path: "/blog/categories", name: "Categories", category: "Blog" },
      { path: "/blog/comments", name: "Comments", category: "Blog" },

      // Projects
      { path: "/projects", name: "Projects", category: "Projects" },
      { path: "/projects/features", name: "Project Features", category: "Projects" },
      { path: "/projects/gallery", name: "Project Gallery", category: "Projects" },
      { path: "/projects/tech-stack", name: "Tech Stack", category: "Projects" },

      // Testimonials
      { path: "/testimonials", name: "Testimonials", category: "Testimonials" },

      // Profile & Skills
      { path: "/profile", name: "Profile", category: "Personal" },
      { path: "/skills", name: "Skills", category: "Personal" },
      { path: "/experience", name: "Experience", category: "Personal" },
      { path: "/education", name: "Education", category: "Personal" },

      // Engagement
      { path: "/subscribers", name: "Subscribers", category: "Engagement" },
      { path: "/contact-messages", name: "Contact Messages", category: "Engagement" },

      // System
      { path: "/stats", name: "Statistics", category: "System" },
      { path: "/email-templates", name: "Email Templates", category: "System" },
      { path: "/users", name: "Users", category: "System" },
    ],
    []
  );

  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allRoutes.filter(
      (route) =>
        route.name.toLowerCase().includes(query) ||
        route.path.toLowerCase().includes(query.replace(/\s+/g, "-")) ||
        route.category.toLowerCase().includes(query)
    );
  }, [searchQuery, allRoutes]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredRoutes.length > 0) {
      navigate(filteredRoutes[0].path);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  const handleRouteSelect = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getRouteIcon = (category: string) => {
    switch (category) {
      case "Main": return BarChart3;
      case "Blog": return FileText;
      case "Projects": return Folder;
      case "Testimonials": return Star;
      case "Personal": return User;
      case "Engagement": return MessageSquare;
      case "System": return Settings;
      default: return FileText;
    }
  };

  const formatPathForDisplay = (path: string) => path;

  return (
    <>
      <header className="p-1 bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] flex justify-between items-center shadow-sm relative">
        {/* Left side */}
        <div className="flex items-center gap-base flex-1">
          {/* Hamburger – only visible on mobile */}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle menu"
            className="p-2 rounded-lg hover:bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)] transition-all duration-200 z-29"
          >
            <Menu className="icon-md" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-md pointer-events-none">
                  <Search className="icon-sm text-[var(--sidebar-text)]" />
                </div>
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="w-full compact-input pl-xl border border-[var(--border-color)] rounded-md bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)] placeholder-[var(--sidebar-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                />
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && filteredRoutes.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-md shadow-lg bg-[var(--sidebar-bg)] border border-[var(--border-color)] max-h-80 overflow-auto z-50">
                {filteredRoutes.map((route, index) => {
                  const RouteIcon = getRouteIcon(route.category);
                  return (
                    <div
                      key={index}
                      className="px-4 py-3 cursor-pointer border-b border-[var(--border-color)] last:border-b-0 hover:bg-[var(--card-secondary-bg)] transition-colors"
                      onMouseDown={() => handleRouteSelect(route.path)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)]/10 flex items-center justify-center">
                          <RouteIcon className="icon-sm text-[var(--primary-color)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[var(--sidebar-text)] truncate">
                            {route.name}
                          </div>
                          <div className="text-xs text-[var(--sidebar-text)] flex items-center gap-2 mt-1">
                            <span className="truncate">{formatPathForDisplay(route.path)}</span>
                            <span className="text-[var(--primary-color)] bg-[var(--primary-color)]/10 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                              {route.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {showSearchResults && searchQuery.trim() && filteredRoutes.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-md shadow-lg bg-[var(--sidebar-bg)] border border-[var(--border-color)] p-4 z-50">
                <div className="text-center text-[var(--sidebar-text)]">
                  No pages found for "{searchQuery}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: notifications */}
        <div className="flex items-center gap-md">
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(true)}
              aria-label="Notifications"
              className="relative p-2 rounded-lg hover:bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)] transition-colors duration-200"
            >
              <Bell className="icon-md" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[var(--danger-color)] text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={handleDrawerClose}
        onUnreadCountChange={handleUnreadCountChange}
      />
    </>
  );
};

export default TopBar;