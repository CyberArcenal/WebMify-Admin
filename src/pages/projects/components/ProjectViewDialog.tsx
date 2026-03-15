// src/pages/projects/components/ProjectViewDialog.tsx
import React, { useState } from 'react';
import Modal from '../../../components/UI/Modal';
import Button from '../../../components/UI/Button';
import {
  Briefcase, Calendar, Edit, Star, Eye, Globe, Github,
  Layers, Image, Code, User, Zap, Users, Clock, DollarSign
} from 'lucide-react';
import { formatDate } from '../../../utils/formatters';
import { Link } from 'react-router-dom';
import { Project } from '@/api/core/project';

interface ProjectViewDialogProps {
  isOpen: boolean;
  project: Project | null;
  loading: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
}

const ProjectViewDialog: React.FC<ProjectViewDialogProps> = ({
  isOpen,
  project,
  loading,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'gallery' | 'techstack'>('overview');

  if (!project && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Details" size="xl">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : project ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[var(--accent-purple)] text-white">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sidebar-text)]">
                  {project.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Slug: {project.slug} • ID: {project.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {project.featured && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
              {onEdit && (
                <Button variant="secondary" size="sm" onClick={() => onEdit(project)}>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--border-color)]">
            <nav className="flex gap-4">
              {(['overview', 'features', 'gallery', 'techstack'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-[var(--accent-blue)] text-[var(--accent-blue)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--sidebar-text)]'
                  }`}
                >
                  {tab}
                  {tab === 'features' && project.features.length > 0 && (
                    <span className="ml-2 text-xs bg-[var(--accent-blue)] text-white rounded-full px-1.5 py-0.5">
                      {project.features.length}
                    </span>
                  )}
                  {tab === 'gallery' && project.gallery_images.length > 0 && (
                    <span className="ml-2 text-xs bg-[var(--accent-blue)] text-white rounded-full px-1.5 py-0.5">
                      {project.gallery_images.length}
                    </span>
                  )}
                  {tab === 'techstack' && project.tech_stack_details.length > 0 && (
                    <span className="ml-2 text-xs bg-[var(--accent-blue)] text-white rounded-full px-1.5 py-0.5">
                      {project.tech_stack_details.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="mt-4">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  {/* Description */}
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Description</h4>
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-line">{project.description}</p>
                  </div>

                  {/* Technologies */}
                  {project.technologies_list.length > 0 && (
                    <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                      <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                        <Code className="w-4 h-4 mr-1" /> Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies_list.map(tech => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-[var(--card-bg)] text-[var(--text-secondary)] rounded-md text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges & Solutions */}
                  {project.challenges && project.solutions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.challenges && (
                        <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                          <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Challenges</h4>
                          <p className="text-sm text-[var(--text-secondary)]">{project.challenges}</p>
                        </div>
                      )}
                      {project.solutions && (
                        <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                          <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Solutions</h4>
                          <p className="text-sm text-[var(--text-secondary)]">{project.solutions}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Testimonial */}
                  {project.testimonial && (
                    <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                      <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Testimonial</h4>
                      <p className="text-sm italic text-[var(--text-secondary)]">"{project.testimonial.content}"</p>
                      <p className="text-xs mt-1 text-[var(--sidebar-text)]">
                        – {project.testimonial.author}, {project.testimonial.position}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Image */}
                  {project.image_url && (
                    <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                      <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Featured Image</h4>
                      <img src={project.image_url} alt={project.title} className="w-full rounded-md" />
                    </div>
                  )}

                  {/* Links */}
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Links</h4>
                    <div className="space-y-2">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[var(--accent-blue)] hover:underline"
                        >
                          <Globe className="w-4 h-4" /> Live Demo
                        </a>
                      )}
                      {project.source_code_url && (
                        <a
                          href={project.source_code_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[var(--accent-blue)] hover:underline"
                        >
                          <Github className="w-4 h-4" /> Source Code
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Client & Development */}
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Project Info</h4>
                    {project.client && (
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <User className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span className="text-[var(--sidebar-text)]">Client: {project.client}</span>
                      </div>
                    )}
                    {project.development_time && (
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span className="text-[var(--sidebar-text)]">Time: {project.development_time}</span>
                      </div>
                    )}
                  </div>

                  {/* Impact Stats */}
                  {Object.values(project.impact_stats).some(v => v) && (
                    <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                      <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Impact</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {project.impact_stats.sales_increase && (
                          <div>
                            <span className="text-xs text-[var(--text-secondary)]">Sales Increase</span>
                            <div className="font-medium text-sm text-[var(--sidebar-text)]">{project.impact_stats.sales_increase}</div>
                          </div>
                        )}
                        {project.impact_stats.load_time && (
                          <div>
                            <span className="text-xs text-[var(--text-secondary)]">Load Time</span>
                            <div className="font-medium text-sm text-[var(--sidebar-text)]">{project.impact_stats.load_time}</div>
                          </div>
                        )}
                        {project.impact_stats.users && (
                          <div>
                            <span className="text-xs text-[var(--text-secondary)]">Users</span>
                            <div className="font-medium text-sm text-[var(--sidebar-text)]">{project.impact_stats.users}</div>
                          </div>
                        )}
                        {project.impact_stats.test_coverage && (
                          <div>
                            <span className="text-xs text-[var(--text-secondary)]">Test Coverage</span>
                            <div className="font-medium text-sm text-[var(--sidebar-text)]">{project.impact_stats.test_coverage}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="bg-[var(--card-secondary-bg)] p-3 rounded-md">
                    <h4 className="font-medium mb-2 flex items-center text-[var(--sidebar-text)]">
                      <Calendar className="w-4 h-4 mr-1" /> Timeline
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Created:</span>
                        <span className="font-medium text-[var(--sidebar-text)]">{formatDate(project.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-secondary)]">Updated:</span>
                        <span className="font-medium text-[var(--sidebar-text)]">{formatDate(project.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Features</h4>
                {project.features.length === 0 ? (
                  <p className="text-center py-4 text-[var(--text-secondary)]">No features added.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {project.features.map((feat, idx) => (
                      <li key={idx} className="text-sm text-[var(--text-secondary)]">{feat.description}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Gallery</h4>
                {project.gallery_images.length === 0 ? (
                  <p className="text-center py-4 text-[var(--text-secondary)]">No gallery images.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {project.gallery_images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.image_url}
                        alt={`Gallery ${idx+1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'techstack' && (
              <div>
                <h4 className="font-medium mb-2 text-[var(--sidebar-text)]">Tech Stack</h4>
                {project.tech_stack_details.length === 0 ? (
                  <p className="text-center py-4 text-[var(--text-secondary)]">No tech stack items.</p>
                ) : (
                  <div className="space-y-3">
                    {project.tech_stack_details.map((tech, idx) => (
                      <div key={idx} className="bg-[var(--card-secondary-bg)] p-2 rounded-md">
                        <span className="font-medium text-sm text-[var(--sidebar-text)]">{tech.name}</span>
                        <span className="text-xs text-[var(--text-secondary)] ml-2">({tech.category})</span>
                        {tech.icon && <span className="text-xs ml-2">Icon: {tech.icon}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">Project not found.</p>
      )}
    </Modal>
  );
};

export default ProjectViewDialog;