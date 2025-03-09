import { useState, useCallback, useEffect } from "react";
import type { Page } from "../api/api";
import { api } from "../api/myApi";
import log from "../utils/logger";

export const usePdfManager = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const getPdfPages = async (file_id: string) => {
    log.info("Getting pages for file_id:", file_id);
    try {
      const response = await api.getPdfPages(file_id);
      return response.data;
    } catch (error) {
      console.error("Error getting pages:", error);
      return [];
    }
  };

  const handleUploadSuccess = useCallback(async (fileId: string) => {
    log.info("Handle Upload success for file_id:", fileId);
    const newPages = await getPdfPages(fileId);
    setPages((prevPages) => [...prevPages, ...newPages]);
  }, []);

  const handleCheckboxChange = useCallback((pageId: string, checked: boolean) => {
    log.info("Handle Checkbox change for page: ", pageId, ", checked: ", checked);
    // Search for given page and update its checked status
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.page_id === pageId) {
          return {
            ...page,
            checked,
          };
        }
        log.debug("Updated page: ", { ...page, checked });
        return page;
      }),
    );
  }, []);

  const handleInsertPage = useCallback((draggedPageId: string, targetPageId: string) => {
    setPages((prevPages) => {
      log.info("Handle inserting page:", draggedPageId, "before page:", targetPageId);
      const draggedIndex = prevPages.findIndex((p) => p.page_id === draggedPageId);
      const targetIndex = prevPages.findIndex((p) => p.page_id === targetPageId);
      log.debug("Dragged index:", draggedIndex, "Target index:", targetIndex);

      if (draggedIndex === -1 || targetIndex === -1) {
        log.error("Invalid dragged or target page index");
        return prevPages;
      }
      const newPages = [...prevPages];

      // Insert dragged page before target page
      const [draggedPage] = newPages.splice(draggedIndex, 1);
      newPages.splice(targetIndex, 0, draggedPage);

      return newPages;
    });
  }, []);

  useEffect(() => {
    log.info("Setting up cleanup on window unload");
    const cleanup = async () => await api.cleanUpTempFiles();

    window.addEventListener("beforeunload", cleanup);
    return () => {
      window.removeEventListener("beforeunload", cleanup);
      cleanup();
    };
  }, []);

  return { pages, handleUploadSuccess, handleCheckboxChange, handleInsertPage };
};
