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
    const [draggedPage, setDraggedPage] = useState<string | null>(null);

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
      event.preventDefault();
      const targetFileId = event.dataTransfer.getData("text/plain");
      if (draggedPage !== targetFileId) {
        setPages(prevPages => {
          const updatedPages = [...prevPages];
          // Find the index of the dragged page and the target page
          const draggedPageIndex = updatedPages.findIndex(page => page.fileId === draggedPage);
          const targetPageIndex = updatedPages.findIndex(page => page.fileId === targetFileId);
          // Swap the pages
          if (draggedPageIndex !== -1 && targetPageIndex !== -1) {
            const temp = updatedPages[draggedPageIndex];
            updatedPages[draggedPageIndex] = updatedPages[targetPageIndex];
            updatedPages[targetPageIndex] = temp;
          }
          return updatedPages;
        });
    }}

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, fileId: string) => {
      event.dataTransfer.setData("text/plain", fileId);
      setDraggedPage(fileId);
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