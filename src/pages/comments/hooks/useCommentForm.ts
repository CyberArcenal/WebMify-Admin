// src/pages/comments/hooks/useCommentForm.ts
import { Comment } from "@/api/core/comment";
import { useState } from "react";

type FormMode = "add" | "edit";

interface UseCommentFormReturn {
  isOpen: boolean;
  mode: FormMode;
  commentId: number | null;
  initialData: Partial<Comment> | null;
  openAdd: () => void;
  openEdit: (comment: Comment) => void;
  close: () => void;
}

const useCommentForm = (): UseCommentFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [commentId, setCommentId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<Comment> | null>(null);

  const openAdd = () => {
    setMode("add");
    setCommentId(null);
    setInitialData({});
    setIsOpen(true);
  };

  const openEdit = (comment: Comment) => {
    setMode("edit");
    setCommentId(comment.id);
    setInitialData(comment);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setCommentId(null);
    setInitialData(null);
  };

  return {
    isOpen,
    mode,
    commentId,
    initialData,
    openAdd,
    openEdit,
    close,
  };
};

export default useCommentForm;