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

    console.log("Pages", pages);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      return;
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, pageNumber: number) => {
      event.dataTransfer.setData("text/plain", pageNumber.toString());
    }

    const handleCheckboxChange = (fileId: string, checked: boolean) => {
      // Search for given page and update its checked status
      setPages(prevPages => prevPages.map(page => {
        if (page.fileId === fileId) {
          return {
            ...page,
            checked
          };
        }
        return page;
      }));
    }

    return (
      <div className="grid grid-cols-5 gap-4 mt-4 bg-custom-dark p-4">
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