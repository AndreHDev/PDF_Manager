import { useEffect, useState } from 'react';
import { api } from '../api/myApi';
//import { createCanvas, loadImage } from 'canvas';
import ThumbnailItem from './ThumbnailItem';

export interface Page {
  thumbnail: string;
  pageNumber: number;
  checked: boolean;
}

interface IProps {
    fileIds: string[];
}

const ThumbnailGrid = ({ fileIds }: IProps) => {
    const [thumbnails, setThumbnails] = useState<string[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
  
    useEffect(() => {
      if (fileIds.length === 0) return;
      
        const fetchThumbnails = async () => {
        try {
          for (const fileId of fileIds) {
            const response = await api.getAllThumbnailsForFileThumbnailsFileIdGet(fileId);
            console.log("Thumbnails for file", fileId, response.data.thumbnails);
            setThumbnails(prevThumbnails => [...prevThumbnails, ...response.data.thumbnails]);
          }
        } catch (error) {
          console.error("Failed to load thumbnails", error);
        }
      };
  
      fetchThumbnails();

    }, [fileIds]);

    useEffect(() => {
      setPages(thumbnails.map((thumbnail, index) => ({
        thumbnail,
        pageNumber: index + 1,
        checked: true
      })));
    }, [thumbnails]);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      return;
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, pageNumber: number) => {
      event.dataTransfer.setData("text/plain", pageNumber.toString());
    }

    const handleCheckboxChange = (thumbnail: string, checked: boolean) => {
      // Search for given page and update its checked status
      // TODO: Probably should use an ID here
      setPages(prevPages => prevPages.map(page => {
        if (page.thumbnail === thumbnail) {
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