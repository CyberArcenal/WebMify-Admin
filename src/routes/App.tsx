// src/renderer/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../layouts/Layout";
import DashboardPage from "../pages/dashboard";
import PageNotFound from "../components/Shared/PageNotFound";
import ProtectedRoute from "../app/ProtectedRoute";
import LoginPage from "@/pages/auth/login";
import CategoriesPage from "@/pages/categories";
import BlogsPage from "@/pages/blog";
import CommentsPage from "@/pages/comments";
import ProjectsPage from "@/pages/projects";
import EducationPage from "@/pages/education";
import ContactMessagesPage from "@/pages/contact-messages";
import EmailTemplatesPage from "@/pages/email-templates";
import ExperiencePage from "@/pages/experience";
import ProfilePage from "@/pages/profile";
import ProjectFeaturesPage from "@/pages/project-features";
import ProjectGalleryPage from "@/pages/project-gallery";
import ProjectTechStacksPage from "@/pages/project-techstacks";
import SkillsPage from "@/pages/skills";
import StatsPage from "@/pages/stats";
import SubscribersPage from "@/pages/subscribers";
import TestimonialsPage from "@/pages/testimonials";
import UsersPage from "@/pages/users";
import NotifyLogPage from "@/pages/notifyLog";

// Placeholder components for pages not yet implemented
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-[var(--sidebar-text)]">{name} Page</h1>
    <p className="mt-2 text-[var(--text-secondary)]">This page is under construction.</p>
  </div>
);

// Import actual pages when ready
// import CategoriesPage from "../pages/categories";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Main layout route */}
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Blog */}
          <Route path="blog" element={<BlogsPage />} />
          <Route path="blog/categories" element={<CategoriesPage />} />
          <Route path="blog/comments" element={<CommentsPage/>} />

          {/* Projects */}
          <Route path="projects" element={<ProjectsPage/>} />
          <Route path="projects/features" element={<ProjectFeaturesPage/>} />
          <Route path="projects/gallery" element={<ProjectGalleryPage/>} />
          <Route path="projects/tech-stack" element={<ProjectTechStacksPage/>} />

          {/* Testimonials */}
          <Route path="testimonials" element={<TestimonialsPage/>} />

          {/* Profile & Skills */}
          <Route path="profile" element={<ProfilePage/>} />
          <Route path="skills" element={<SkillsPage/>} />
          <Route path="experience" element={<ExperiencePage/>} />
          <Route path="education" element={<EducationPage/>} />

          {/* Engagement */}
          <Route path="subscribers" element={<SubscribersPage/>} />
          <Route path="contact-messages" element={<ContactMessagesPage/>} />

          {/* System */}
          <Route path="stats" element={<StatsPage />} />
          <Route path="email-templates" element={<EmailTemplatesPage/>} />
          <Route path="notify-logs" element={<NotifyLogPage/>} />
          <Route path="users" element={<UsersPage/>} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;