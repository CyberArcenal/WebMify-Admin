// components/Sidebar.tsx (Portfolio Admin)
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  Code,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Mail,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Tag,
  User,
  Award,
  BookOpen,
  Send,
  BarChart3,
  Database,
  Shield,
  Inbox,
  MailOpen,
  Globe,
  Layers,
  Palette,
  FolderTree,
} from "lucide-react";
import { version, name } from "../../../package.json";

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  path: string;
  name: string;
  icon: React.ComponentType<any>;
  category?: string;
  children?: MenuItem[];
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const title = toTitleCase(name);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );

  // Define menu items for portfolio admin
  const menuItems: MenuItem[] = [
    // Dashboard
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      category: "dashboard",
    },

    // Content Management
    {
      path: "",
      name: "Blog",
      icon: BookOpen,
      category: "content",
      children: [
        { path: "/blog", name: "All Posts", icon: FileText },
        { path: "/blog/categories", name: "Categories", icon: FolderTree },
        { path: "/blog/comments", name: "Comments", icon: MessageSquare },
      ],
    },
    {
      path: "",
      name: "Projects",
      icon: Briefcase,
      category: "content",
      children: [
        { path: "/projects", name: "All Projects", icon: Layers },
        { path: "/projects/features", name: "Features", icon: Star },
        { path: "/projects/gallery", name: "Gallery", icon: Image },
        { path: "/projects/tech-stack", name: "Tech Stack", icon: Code },
      ],
    },
    {
      path: "/testimonials",
      name: "Testimonials",
      icon: Award,
      category: "content",
    },

    // Profile & Skills
    {
      path: "/profile",
      name: "Profile",
      icon: User,
      category: "profile",
    },
    {
      path: "/skills",
      name: "Skills",
      icon: Code,
      category: "profile",
    },
    {
      path: "/experience",
      name: "Experience",
      icon: Briefcase,
      category: "profile",
    },
    {
      path: "/education",
      name: "Education",
      icon: GraduationCap,
      category: "profile",
    },

    // Engagement
    {
      path: "/subscribers",
      name: "Subscribers",
      icon: Mail,
      category: "engagement",
    },
    {
      path: "/contact-messages",
      name: "Contact Messages",
      icon: Send,
      category: "engagement",
    },

    // System
    {
      path: "",
      name: "System",
      icon: Settings,
      category: "system",
      children: [
        { path: "/stats", name: "Statistics", icon: BarChart3 },
        { path: "/email-templates", name: "Email Templates", icon: MailOpen },
        { path: "/users", name: "Users", icon: Users },
      ],
    },
  ];

  const filteredMenu = menuItems
    .map((item) => {
      if (item.children) {
        const children = item.children.filter(
          (child) => !(child.path === "/users1"), // optional filter
        );
        return { ...item, children };
      }
      return item;
    })
    .filter((item) => (item.children ? item.children.length > 0 : true));

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActivePath = (path: string) => location.pathname === path;
  const isDropdownActive = (items: MenuItem[] = []) =>
    items.some((item) => isActivePath(item.path));

  // Auto‑open dropdowns when a child is active
  useEffect(() => {
    filteredMenu.forEach((item) => {
      if (item.children && isDropdownActive(item.children)) {
        setOpenDropdowns((prev) => ({ ...prev, [item.name]: true }));
      }
    });
  }, [location.pathname]);

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = hasChildren
        ? isDropdownActive(item.children)
        : isActivePath(item.path);
      const isOpenDropdown = openDropdowns[item.name];

      return (
        <li key={item.path || item.name} className="mb-1 w-full">
          {hasChildren ? (
            <>
              <div
                onClick={() => toggleDropdown(item.name)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer w-full
                  ${
                    isActive
                      ? "bg-[var(--primary-color)] text-[var(--sidebar-text)] shadow-md"
                      : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"
                  }
                  ${!isOpen ? "justify-center" : "justify-between"}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-[var(--sidebar-text)]"
                        : "text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-text)]"
                    }`}
                  />
                  {isOpen && <span className="font-medium">{item.name}</span>}
                </div>
                {isOpen && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpenDropdown ? "rotate-180" : ""
                    } ${
                      isActive
                        ? "text-[var(--sidebar-text)]"
                        : "text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-text)]"
                    }`}
                  />
                )}
              </div>

              {/* Submenu */}
              <div
                className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                  isOpenDropdown ? "max-h-96" : "max-h-0"
                }`}
              >
                {isOpen ? (
                  // Expanded mode
                  <ul
                    className="ml-4 border-l-2 pl-3 mt-1 space-y-1"
                    style={{ borderColor: "var(--primary-color)" }}
                  >
                    {item.children?.map((child) => {
                      const isChildActive = isActivePath(child.path);
                      return (
                        <li key={child.path} className="w-full">
                          <Link
                            to={child.path}
                            className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm w-full
                              ${
                                isChildActive
                                  ? "text-[var(--sidebar-text)] bg-[var(--primary-color)]/20 font-semibold"
                                  : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"
                              }
                            `}
                          >
                            <child.icon className="w-4 h-4" />
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  // Collapsed mode
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--primary-color)]"></div>
                    <ul className="flex flex-col items-center space-y-1 mt-1">
                      {item.children?.map((child) => {
                        const isChildActive = isActivePath(child.path);
                        return (
                          <li key={child.path} className="w-full">
                            <Link
                              to={child.path}
                              className={`group flex items-center justify-center gap-3 px-3 py-2 ml-3 rounded-lg transition-all duration-200 text-sm w-[calc(100%-12px)]
                                ${
                                  isChildActive
                                    ? "text-[var(--sidebar-text)] bg-[var(--primary-color)]/20 font-semibold"
                                    : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"
                                }
                              `}
                            >
                              <child.icon className="w-4 h-4" />
                              {/* text hidden */}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full
                ${
                  isActive
                    ? "bg-[var(--primary-color)] text-[var(--sidebar-text)] shadow-md"
                    : "text-[var(--sidebar-text)] hover:bg-[var(--primary-color)] hover:text-[var(--sidebar-text)]"
                }
                ${!isOpen ? "justify-center" : "justify-between"}
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-[var(--sidebar-text)]"
                      : "text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-text)]"
                  }`}
                />
                {isOpen && <span className="font-medium">{item.name}</span>}
              </div>
              {isOpen && (
                <ChevronRight
                  className={`w-4 h-4 transition-opacity duration-200 ${
                    isActive
                      ? "opacity-100 text-[var(--sidebar-text)]"
                      : "opacity-0 group-hover:opacity-50 text-[var(--sidebar-text)]"
                  }`}
                />
              )}
            </Link>
          )}
        </li>
      );
    });
  };

  const categories = [
    { id: "dashboard", name: "Dashboard" },
    { id: "content", name: "Content Management" },
    { id: "profile", name: "Profile & Skills" },
    { id: "engagement", name: "Engagement" },
    { id: "system", name: "System" },
  ];

  return (
    <div
      className={`
        fixed md:relative inset-y-0 left-0
        bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]
        rounded-r-3xl shadow-xl
        transform transition-all duration-300 ease-in-out
        z-30 flex flex-col h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        md:${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--sidebar-border)] bg-[var(--card-bg)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={"./logo.png"}
              alt="Portfolio Logo"
              className="h-full w-full object-cover"
            />
          </div>
          {isOpen && (
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-[var(--sidebar-text)]">
                {title}
              </h2>
              <p className="text-xs text-[var(--sidebar-text)]">
                Portfolio Admin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scrollbar p-4">
        {categories?.map((category) => {
          const categoryItems = filteredMenu.filter(
            (item) => item.category === category.id,
          );
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="mb-6">
              {isOpen && (
                <h6 className="px-4 py-2 text-xs font-semibold text-[var(--sidebar-text)] uppercase tracking-wider">
                  {category.name}
                </h6>
              )}
              <ul className="space-y-1">{renderMenuItems(categoryItems)}</ul>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--sidebar-border)] text-center flex-shrink-0">
        {isOpen ? (
          <p className="text-xs text-[var(--sidebar-text)]">
            {version} • © {new Date().getFullYear()} {name}
          </p>
        ) : (
          <p className="text-xs text-[var(--sidebar-text)]">
            © {new Date().getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
