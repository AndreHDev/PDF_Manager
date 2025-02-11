import { useEffect, useState } from 'react';
import { api } from '../api/myApi';
//import { createCanvas, loadImage } from 'canvas';

interface IProps {
    fileIds: string[];
}

const ThumbnailGrid = ({ fileIds }: IProps) => {
    const [thumbnails, setThumbnails] = useState<string[]>([]);
  
    useEffect(() => {
      if (fileIds.length === 0) return;
      
        const fetchThumbnails = async () => {
        try {
          for (const fileId of fileIds) {
            const response = await api.getAllThumbnailsForFileThumbnailsFileIdGet(fileId);
            console.log("Thumbnails for file", fileId, response.data.thumbnails);
            setThumbnails(prevThumbnails => [...prevThumbnails, response.data.thumbnails]);
          }
        } catch (error) {
          console.error("Failed to load thumbnails", error);
        }
      };
  
      fetchThumbnails();
      

    }, [fileIds]);

    console.log("Thumbnails:", thumbnails);
    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {thumbnails.map((thumb, index) => (
          <img key={index} src={thumb} alt={`Thumbnail ${index}`} className="w-full h-auto rounded-lg" onError={(e) => console.log('Image failed to load:', thumb, e)} />
        ))}
      </div>
    );
  };

export default ThumbnailGrid;