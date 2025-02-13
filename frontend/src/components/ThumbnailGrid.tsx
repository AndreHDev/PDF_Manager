import { useEffect, useState } from 'react';
import { api } from '../api/myApi';
//import { createCanvas, loadImage } from 'canvas';
import ThumbnailItem from './ThumbnailItem';

export interface Page {
  fileId: string;
  thumbnail: string;
  pageNumber: number;
  checked: boolean;
}

interface IProps {
    fileIds: string[];
}

const ThumbnailGrid = ({ fileIds }: IProps) => {
    const [pages, setPages] = useState<Page[]>([]);
    const [draggedPage, setDraggedPage] = useState<{ fileId: string, pageNumber: number } | null>(null);

    useEffect(() => {
      if (fileIds.length === 0) return;
      
        const fetchThumbnails = async () => {
        try {
          for (const fileId of fileIds) {
            // check if thumbnails are already loaded
            if (pages.some(page => page.fileId === fileId)) {
              console.log("Thumbnails already loaded for file", fileId);
              continue;
            }

            const response = await api.getAllThumbnailsForFileThumbnailsFileIdGet(fileId);
            console.log("Receiveid thumbnails for file", fileId, response.data.thumbnails);
            
            setPages((prevPages: Page[]) => [
              ...prevPages,
              ...response.data.thumbnails.map((thumbnail: string, index: number) => ({
              fileId,
              thumbnail,
              pageNumber: index,
              checked: true
              }))
            ]);
          }
        } catch (error) {
          console.error("Failed to load thumbnails", error);
        }
      };
  
      fetchThumbnails();

    }, [fileIds, pages]);

    console.log("Current Pages: ", pages);

    const handleCheckboxChange = (fileId: string, pageNumber: number, checked: boolean) => {
      // Search for given page and update its checked status
      setPages(prevPages => prevPages.map(page => {
        if (page.fileId === fileId && page.pageNumber === pageNumber) {
          return {
            ...page,
            checked
          };
        }
        return page;
      }));
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

      setPages((prevPages) => {
        const updatedPages = [...prevPages];
  
        // Find the indexes of the dragged and target pages
        const draggedPageIndex = updatedPages.findIndex(page => page.fileId === draggedPage.fileId && page.pageNumber === draggedPage.pageNumber);
        const targetPageIndex = updatedPages.findIndex(page => page.fileId === targetFileId && page.pageNumber === targetPageNumber);
  
        // Swap the pages
        if (draggedPageIndex !== -1 && targetPageIndex !== -1) {
          [updatedPages[draggedPageIndex], updatedPages[targetPageIndex]] = [updatedPages[targetPageIndex], updatedPages[draggedPageIndex]];
        }
  
        return updatedPages;
      });

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