import { useState } from 'react';
import type { Page } from '../api/api';
import ThumbnailItem from './ThumbnailItem';
import log from '../utils/logger';

interface IProps {
    pages: Page[];
    onCheckBoxChange: (pageId: string, checked: boolean ) => void;
    insertPage: (draggedPageId: string, targetPageId: string) => void;
}

const ThumbnailGrid = ({ pages, onCheckBoxChange, insertPage: insertPage }: IProps) => {

    const [draggedPage, setDraggedPage] = useState<{ pageId: string} | null>(null);

    log.debug("Current Pages: ", pages);

    const handleCheckboxChange = (pageId: string, checked: boolean) => {
      log.info("Checkbox change triggered", pageId, checked);
      onCheckBoxChange(pageId, checked);
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      log.info("Drop event triggered");
      event.preventDefault();

      // Get the drop target from event
      const targetElement = (event.target as Element).closest("[data-file-id][data-page-number]");

      if (!draggedPage || !targetElement) {
        log.error("Invalid drop target or no dragged page.");
        return;
      }
      
      const targetPageId = targetElement.getAttribute("data-file-id");
      
      log.debug("Target file ID", targetPageId, "Dragged page", draggedPage.pageId);

      if (!targetPageId) {
        log.info("Invalid target pageId");
        return;
      }

      if (draggedPage.pageId === targetPageId) {
        log.info("Same page, no need to move");
        return;
      }

      insertPage(draggedPage.pageId, targetPageId);
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, pageId: string) => {
      log.info("Drag start", pageId, event);
      setDraggedPage({ pageId });
    }

    return (
      <div className="grid grid-cols-5 gap-4 mt-4 bg-custom-dark p-4" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {pages.map((page, index) => (
        <ThumbnailItem
          key={index}
          page={page}
          onDragStart={handleDragStart}
          onCheckboxChange={handleCheckboxChange}
        />
      ))}
    </div>
    );
  };

export default ThumbnailGrid;