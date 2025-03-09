import { useState } from "react";
import log from "../utils/logger";

export const useDragAndDrop = (
  insertPage: (draggedPageId: string, targetPageId: string) => void,
) => {
  const [draggedPage, setDraggedPage] = useState<{ pageId: string } | null>(null);
  const [targetPageId, setTargetPageId] = useState<string | null>(null);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, pageId: string) => {
    log.info("Drag start", pageId, event);
    setDraggedPage({ pageId });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, pageId: string) => {
    event.preventDefault();
    setTargetPageId(pageId);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    log.info("Drop event triggered");
    event.preventDefault();

    const curTargetPageId = targetPageId;

    // Reset target page (and with that also the drag indicator)
    setTargetPageId(null);

    // Get the drop target from event
    const targetElement = (event.target as Element).closest("[data-page-id]");

    if (!draggedPage || !targetElement) {
      log.error("Invalid drop target or no dragged page.");
      return;
    }

    log.debug("Target pageId", curTargetPageId, "Dragged page", draggedPage.pageId);

    if (!curTargetPageId) {
      log.info("Invalid target pageId");
      return;
    }

    if (draggedPage.pageId === curTargetPageId) {
      log.info("Same page, no need to move");
      return;
    }

    insertPage(draggedPage.pageId, curTargetPageId);
  };

  return { handleDragStart, handleDragOver, handleDrop, targetPageId };
};
