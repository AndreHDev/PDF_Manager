import { useEffect, useState } from 'react';
import { api } from '../api/myApi';

interface IProps {
    fileIds: string[];
}

const ThumbnailGrid = ({ fileIds }: IProps) => {
    const [thumbnails, setThumbnails] = useState<string[]>([]);
  
    useEffect(() => {
      //TODO: Check if !fileIds also works
      if (fileIds.length === 0) return;
        const fetchThumbnails = async () => {
        try {
          for (const fileId of fileIds) {
            const response = await api.getAllThumbnailsForFileThumbnailsFileIdGet(fileId);
            setThumbnails(prevThumbnails => [...prevThumbnails, response.data.thumbnails]);
          }
        } catch (error) {
          console.error("Failed to load thumbnails", error);
        }
      };
  
      fetchThumbnails();
    }, [fileIds]);
  
    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {thumbnails.map((thumb, index) => (
          <img key={index} src={thumb} alt={`Thumbnail ${index}`} className="w-full h-auto rounded-lg" />
        ))}
      </div>
    );
  };

export default ThumbnailGrid;