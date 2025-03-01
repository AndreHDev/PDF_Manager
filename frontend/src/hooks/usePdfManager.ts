import { useState, useCallback, useEffect } from "react";
import type { Page } from "../api/api";
import { api } from "../api/myApi";

export const usePdfManager = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const getPdfPages = async (file_id: string) => {
    try {
      const response = await api.getPdfPages(file_id);
      return response.data;
    } catch (error) {
      console.error("Error getting pages:", error);
      return [];
    }
  };

  const handleUploadSuccess = useCallback(async (fileId: string) => {
    const newPages = await getPdfPages(fileId);
    setPages((prevPages) => [...prevPages, ...newPages]);
  }, []);

  const handleCheckboxChange = useCallback(
    (pageId: string, checked: boolean) => {
      // Search for given page and update its checked status
      setPages((prevPages) =>
        prevPages.map((page) => {
          if (page.page_id === pageId) {
            return {
              ...page,
              checked,
            };
          }
          return page;
        })
      );
    },
    []
  );

  const handleInsertPage = useCallback(
    (draggedPageId: string, targetPageId: string) => {
      setPages((prevPages) => {
        const draggedIndex = prevPages.findIndex(
          (p) => p.page_id === draggedPageId
        );
        const targetIndex = prevPages.findIndex(
          (p) => p.page_id === targetPageId
        );
        console.log(
          "Dragged index:",
          draggedIndex,
          "Target index:",
          targetIndex
        );

        if (draggedIndex === -1 || targetIndex === -1) return prevPages;

        const newPages = [...prevPages];

        // Insert dragged page before target page
        const [draggedPage] = newPages.splice(draggedIndex, 1);
        newPages.splice(targetIndex, 0, draggedPage);

        return newPages;
      });
    },
    []
  );

  useEffect(() => {
    const cleanup = async () => await api.cleanUpTempFiles();

    window.addEventListener("beforeunload", cleanup);
    return () => {
      window.removeEventListener("beforeunload", cleanup);
      cleanup();
    };
  }, []);

  return { pages, handleUploadSuccess, handleCheckboxChange, handleInsertPage };
};
