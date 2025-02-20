import { useState } from 'react';
import type { Page } from '../api/api';
//import { createCanvas, loadImage } from 'canvas';
import ThumbnailItem from './ThumbnailItem';


interface IProps {
    pages: Page[];
    onCheckBoxChange: (fileId: string, pageNumber: number, checked: boolean ) => void;
    swapPages: (draggedPage: { fileId: string, pageNumber: number }, targetPage: { fileId: string, pageNumber: number }) => void;
}

const ThumbnailGrid = ({ pages, onCheckBoxChange, swapPages }: IProps) => {

    const [draggedPage, setDraggedPage] = useState<{ fileId: string, pageNumber: number } | null>(null);

    console.log("Current Pages: ", pages);

    const handleCheckboxChange = (fileId: string, pageNumber: number, checked: boolean) => {
      onCheckBoxChange(fileId, pageNumber, checked);
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
      
      const targetFileId = targetElement.getAttribute("data-file-id");
      const targetPageNumber = parseInt(targetElement.getAttribute("data-page-number") || "-1", 10);
      console.log("Target file ID", targetFileId, "Target page number", targetPageNumber, "Dragged page", draggedPage);

      if (!targetFileId || targetPageNumber === -1) {
        console.log("Invalid target file ID or page number");
        return;
      }

      if (draggedPage.fileId === targetFileId && draggedPage.pageNumber === targetPageNumber) {
        console.log("Same page, no need to move");
        return;
      }

      // Swap pages
      swapPages(draggedPage, { fileId: targetFileId, pageNumber: targetPageNumber });
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, fileId: string, pageNumber: number) => {
      console.log("Drag start", fileId, "Page: ", pageNumber, event);
      setDraggedPage({ fileId, pageNumber });
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