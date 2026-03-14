// src/pages/projects/hooks/useProjectView.ts
import { useState } from 'react';
import { showError } from '../../../utils/notification';
import projectAPI, { Project } from '@/api/core/project';

export const useProjectView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await projectAPI.get(id);
      setProject(data);
    } catch (err: any) {
      showError(err.message || 'Failed to load project details');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setProject(null);
  };

  return {
    isOpen,
    loading,
    project,
    open,
    close,
  };
};