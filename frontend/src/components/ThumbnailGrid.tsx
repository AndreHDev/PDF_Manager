import { useState } from 'react';
import type { Page } from '../api/api';
import ThumbnailItem from './ThumbnailItem';
import log from '../utils/logger';
import './ThumbnailGrid.css';

interface IProps {
    pages: Page[];
    onCheckBoxChange: (pageId: string, checked: boolean ) => void;
    insertPage: (draggedPageId: string, targetPageId: string) => void;
}

const ThumbnailGrid = ({ pages, onCheckBoxChange, insertPage: insertPage }: IProps) => {

    const [draggedPage, setDraggedPage] = useState<{ pageId: string} | null>(null);
    const [targetPageId, setTargetPageId] = useState<string | null>(null);

    log.debug("Current Pages: ", pages);

    const handleCheckboxChange = (pageId: string, checked: boolean) => {
      log.info("Checkbox change triggered", pageId, checked);
      onCheckBoxChange(pageId, checked);
    }

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
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, pageId: string) => {
      log.info("Drag start", pageId, event);
      setDraggedPage({ pageId });
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>, pageId: string) => {
      event.preventDefault();
      setTargetPageId(pageId);
    }

    return (
      <div className="grid grid-cols-5 gap-4 mt-4 bg-custom-dark p-4" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {pages.map((page, index) => (
        <div
          key={index}
          data-page-id={page.page_id}
          data-page-number={index}
          onDragOver={(e) => handleDragOver(e, page.page_id)}
          className={`relative ${targetPageId === page.page_id ? 'drag-over' : ''}`}
        >
          <ThumbnailItem
            page={page}
            onDragStart={handleDragStart}
            onCheckboxChange={handleCheckboxChange}
          />
          {targetPageId === page.page_id && <div className="drag-indicator"></div>}
        </div>
      ))}
    </div>
    );
  };

export default ThumbnailGrid;