import { useState } from 'react';
import type { Page } from '../api/api';
//import { createCanvas, loadImage } from 'canvas';
import ThumbnailItem from './ThumbnailItem';


interface IProps {
    pages: Page[];
    onCheckBoxChange: (pageId: string, checked: boolean ) => void;
    swapPages: (draggedPageId: string, targetPageId: string) => void;
}

const ThumbnailGrid = ({ pages, onCheckBoxChange, swapPages }: IProps) => {

    const [draggedPage, setDraggedPage] = useState<{ pageId: string} | null>(null);

    console.log("Current Pages: ", pages);

    const handleCheckboxChange = (pageId: string, checked: boolean) => {
      onCheckBoxChange(pageId, checked);
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      console.log("Drop event", event);
      event.preventDefault();

      // Get the drop target from event
      const targetElement = (event.target as Element).closest("[data-file-id][data-page-number]");

      if (!draggedPage || !targetElement) {
        console.log("Invalid drop target or no dragged page.");
        return;
      }
      
      const targetPageId = targetElement.getAttribute("data-file-id");
      
      console.log("Target file ID", targetPageId, "Dragged page", draggedPage.pageId);

      if (!targetPageId) {
        console.log("Invalid target pageId");
        return;
      }

      if (draggedPage.pageId === targetPageId) {
        console.log("Same page, no need to move");
        return;
      }

      // Swap pages
      swapPages(draggedPage.pageId, targetPageId);
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, pageId: string) => {
      console.log("Drag start", pageId, event);
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