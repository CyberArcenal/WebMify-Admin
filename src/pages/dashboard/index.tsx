// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Award,
  Mail,
  MessageSquare,
  Eye,
  Calendar,
  User,
  TrendingUp,
  Users,
  Star,
  Plus,
  RefreshCw,
  AlertTriangle,
  Clock,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import dashboardAPI, { DashboardData } from "@/api/analytics/dashboard";
import ContactMessageViewDialog from "../contact-messages/components/ContactMessageViewDialog";
import { useContactMessageView } from "../contact-messages/hooks/useContactMessageView";
import { ContactMessageWithDetails } from "../contact-messages/hooks/useContactMessages";
import contactMessageAPI from "@/api/core/contact_message";
import { showError, showSuccess } from "@/utils/notification";
import BlogViewDialog from "../blog/components/BlogViewDialog";
import { useBlogView } from "../blog/hooks/useBlogView";

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const messageViewDialog = useContactMessageView();
  const blogViewDialog = useBlogView();
  const handleToggleRead = async (message: ContactMessageWithDetails) => {
    try {
      await contactMessageAPI.patch(message.id, { is_read: !message.is_read });
      showSuccess(
        message.is_read ? "Message marked as unread" : "Message marked as read",
      );
      fetchDashboardData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to refresh dashboard data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick actions for the dashboard
  const quickActions = [
    { label: "New Blog", path: "/blog/new", icon: FileText, color: "blue" },
    {
      label: "New Project",
      path: "/projects/new",
      icon: Briefcase,
      color: "green",
    },
    {
      label: "Add Testimonial",
      path: "/testimonials/new",
      icon: Award,
      color: "purple",
    },
    {
      label: "View Subscribers",
      path: "/subscribers",
      icon: Users,
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div
        className="compact-card rounded-lg transition-all duration-300 ease-in-out"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex justify-center items-center h-48">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-3 transition-colors duration-300"
              style={{ borderColor: "var(--primary-color)" }}
            ></div>
            <p
              className="text-sm transition-colors duration-300"
              style={{ color: "var(--sidebar-text)" }}
            >
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="compact-card rounded-lg transition-all duration-300 ease-in-out"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          className="text-center p-6 transition-colors duration-300"
          style={{ color: "var(--danger-color)" }}
        >
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 transition-colors duration-300" />
          <p className="text-base font-semibold mb-1 transition-colors duration-300">
            Error Loading Dashboard
          </p>
          <p className="text-sm mb-3 transition-colors duration-300">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn btn-primary btn-sm rounded-md flex items-center mx-auto transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md"
          >
            <RefreshCw className="icon-sm mr-1" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div
        className="compact-card rounded-lg transition-all duration-300 ease-in-out"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          className="text-center p-6 transition-colors duration-300"
          style={{ color: "var(--sidebar-text)" }}
        >
          <LayoutDashboard className="w-12 h-12 mx-auto mb-3 transition-colors duration-300" />
          <p className="text-sm">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const { stats, recent_blogs, recent_messages } = dashboardData;

  return (
    <div className="space-y-4 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div
        className="compact-card rounded-lg transition-all duration-300 ease-in-out"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex justify-between items-center p-4">
          <div className="transition-colors duration-300">
            <h2
              className="text-lg font-semibold flex items-center gap-1.5 transition-colors duration-300"
              style={{ color: "var(--sidebar-text)" }}
            >
              <div
                className="w-1.5 h-5 rounded-full transition-colors duration-300"
                style={{ backgroundColor: "var(--accent-blue)" }}
              ></div>
              Dashboard Overview
            </h2>
            <p
              className="text-xs transition-colors duration-300"
              style={{ color: "var(--text-secondary)" }}
            >
              Portfolio insights
            </p>
          </div>
          <div className="flex items-center gap-2 transition-colors duration-300">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-secondary btn-sm rounded-md flex items-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md disabled:opacity-50"
            >
              <RefreshCw
                className={`icon-sm mr-1 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <div
              className="text-xs px-2 py-0.5 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: "var(--card-secondary-bg)",
                color: "var(--text-secondary)",
              }}
            >
              <Clock className="inline-block w-2.5 h-2.5 mr-0.5" />
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-300 ease-in-out">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const colorClasses = {
            blue: {
              background: "var(--accent-blue)",
              hover: "var(--accent-blue-hover)",
            },
            green: {
              background: "var(--accent-green)",
              hover: "var(--accent-green-hover)",
            },
            purple: {
              background: "var(--accent-purple)",
              hover: "var(--accent-purple-hover)",
            },
            orange: {
              background: "var(--accent-orange)",
              hover: "var(--accent-orange-hover)",
            },
          };
          const colors =
            colorClasses[action.color as keyof typeof colorClasses];

          return (
            <Link
              key={index}
              to={action.path}
              className="compact-card rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md group"
              style={{
                background: colors.background,
                border: "1px solid transparent",
              }}
            >
              <div className="relative transition-all duration-300 ease-in-out group-hover:scale-105">
                <Icon
                  className="icon-lg mb-2 transition-colors duration-300"
                  style={{ color: "var(--sidebar-text)" }}
                />
              </div>
              <span
                className="text-xs font-medium text-center transition-colors duration-300"
                style={{ color: "var(--sidebar-text)" }}
              >
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 transition-all duration-300 ease-in-out">
        <StatCard
          title="Total Blogs"
          value={stats.total_blogs}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          link="/blog"
        />
        <StatCard
          title="Total Projects"
          value={stats.total_projects}
          icon={<Briefcase className="w-6 h-6" />}
          color="green"
          link="/projects"
        />
        <StatCard
          title="Testimonials"
          value={stats.total_testimonials}
          icon={<Award className="w-6 h-6" />}
          color="purple"
          link="/testimonials"
        />
        <StatCard
          title="Subscribers"
          value={stats.total_subscribers}
          icon={<Users className="w-6 h-6" />}
          color="orange"
          link="/subscribers"
        />
        <StatCard
          title="Messages"
          value={stats.total_messages}
          icon={<MessageSquare className="w-6 h-6" />}
          color="red"
          link="/contact-messages"
        />
        <StatCard
          title="Total Views"
          value={stats.total_views.toLocaleString()}
          icon={<Eye className="w-6 h-6" />}
          color="indigo"
          link="/stats"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 transition-all duration-300 ease-in-out">
        {/* Recent Blogs */}
        <div
          className="compact-card rounded-lg p-4 transition-all duration-300 ease-in-out hover:shadow-md group"
          style={{
            background: "var(--card-secondary-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-4 transition-colors duration-300">
            <h3
              className="font-semibold flex items-center gap-1.5 transition-colors duration-300 group-hover:text-[var(--accent-blue)]"
              style={{ color: "var(--sidebar-text)" }}
            >
              <FileText className="icon-sm transition-colors duration-300" />
              Recent Blog Posts
            </h3>
            <Link
              to="/blog"
              className="text-xs hover:underline flex items-center transition-all duration-200 ease-in-out cursor-pointer"
              style={{ color: "var(--primary-color)" }}
            >
              View all <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <div className="space-y-3 transition-colors duration-300">
            {recent_blogs?.slice(0, 5).map((blog) => (
              <div
                key={blog.id}
                className="flex items-start justify-between border-b border-[var(--border-color)] pb-3 last:border-0 cursor-pointer hover:bg-[var(--card-hover-bg)] p-2 rounded-md transition-all"
                onClick={() => {blogViewDialog.open(blog.id)}}
              >
                <div className="flex-1">
                  <div
                    className="font-medium text-sm"
                    style={{ color: "var(--sidebar-text)" }}
                  >
                    {blog.title}
                  </div>
                  <div
                    className="flex items-center gap-4 mt-1 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(new Date(blog.published_date), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {blog.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div
          className="compact-card rounded-lg p-4 transition-all duration-300 ease-in-out hover:shadow-md group"
          style={{
            background: "var(--card-secondary-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-4 transition-colors duration-300">
            <h3
              className="font-semibold flex items-center gap-1.5 transition-colors duration-300 group-hover:text-[var(--accent-purple)]"
              style={{ color: "var(--sidebar-text)" }}
            >
              <MessageSquare className="icon-sm transition-colors duration-300" />
              Recent Contact Messages
            </h3>
            <Link
              to="/contact-messages"
              className="text-xs hover:underline flex items-center transition-all duration-200 ease-in-out cursor-pointer"
              style={{ color: "var(--primary-color)" }}
            >
              View all <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <div className="space-y-3 transition-colors duration-300">
            {recent_messages.slice(0, 5).map((msg) => (
              <div
                key={msg.id}
                className="flex items-start justify-between border-b border-[var(--border-color)] pb-3 last:border-0 cursor-pointer hover:bg-[var(--card-hover-bg)] p-2 rounded-md transition-all"
                onClick={() => {
                  messageViewDialog.open(msg.id);
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="font-medium text-sm"
                      style={{
                        color: msg.is_read
                          ? "var(--text-secondary)"
                          : "var(--sidebar-text)",
                      }}
                    >
                      {msg.subject}
                    </div>
                    {!msg.is_read && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                  <div
                    className="flex items-center gap-4 mt-1 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {msg.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {msg.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(new Date(msg.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ContactMessageViewDialog
        isOpen={messageViewDialog.isOpen}
        message={messageViewDialog.message}
        loading={messageViewDialog.loading}
        onClose={messageViewDialog.close}
        onToggleRead={() => {
          if (messageViewDialog.message) {
            handleToggleRead(messageViewDialog.message);
            messageViewDialog.close();
          }
        }}
      />

      <BlogViewDialog
        isOpen={blogViewDialog.isOpen}
        blog={blogViewDialog.blog}
        comments={blogViewDialog.comments}
        loading={blogViewDialog.loading}
        loadingComments={blogViewDialog.loadingComments}
        onClose={blogViewDialog.close}
        onFetchComments={blogViewDialog.fetchComments}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange" | "red" | "indigo";
  link: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  link,
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <Link
      to={link}
      className="compact-card rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
      style={{
        background: "var(--card-secondary-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {title}
        </p>
        <p
          className="text-2xl font-bold mt-1"
          style={{ color: "var(--sidebar-text)" }}
        >
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
    </Link>
  );
};

export default DashboardPage;
