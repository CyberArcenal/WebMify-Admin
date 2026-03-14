// src/renderer/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../layouts/Layout";
import DashboardPage from "../pages/dashboard";
import PageNotFound from "../components/Shared/PageNotFound";
import ProtectedRoute from "../app/ProtectedRoute";
import LoginPage from "@/pages/auth/login";
import CategoriesPage from "@/pages/categories";
import BlogsPage from "@/pages/blog";

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
          <Route path="blog/comments" element={<PlaceholderPage name="Blog Comments" />} />

          {/* Projects */}
          <Route path="projects" element={<PlaceholderPage name="Projects" />} />
          <Route path="projects/features" element={<PlaceholderPage name="Project Features" />} />
          <Route path="projects/gallery" element={<PlaceholderPage name="Project Gallery" />} />
          <Route path="projects/tech-stack" element={<PlaceholderPage name="Tech Stack" />} />

          {/* Testimonials */}
          <Route path="testimonials" element={<PlaceholderPage name="Testimonials" />} />

          {/* Profile & Skills */}
          <Route path="profile" element={<PlaceholderPage name="Profile" />} />
          <Route path="skills" element={<PlaceholderPage name="Skills" />} />
          <Route path="experience" element={<PlaceholderPage name="Experience" />} />
          <Route path="education" element={<PlaceholderPage name="Education" />} />

          {/* Engagement */}
          <Route path="subscribers" element={<PlaceholderPage name="Subscribers" />} />
          <Route path="contact-messages" element={<PlaceholderPage name="Contact Messages" />} />

          {/* System */}
          <Route path="stats" element={<PlaceholderPage name="Statistics" />} />
          <Route path="email-templates" element={<PlaceholderPage name="Email Templates" />} />
          <Route path="users" element={<PlaceholderPage name="Users" />} />
          <Route path="audit" element={<PlaceholderPage name="Audit Trail" />} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;