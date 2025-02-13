import React from 'react';
import type {Page} from "./ThumbnailGrid"

interface ThumbnailItemProps {
  page: Page;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, fileID: string) => void;
  onCheckboxChange: (fileID: string, pageNumber: number, checked: boolean) => void;
}

const ThumbnailItem = ({ page, onDragStart, onCheckboxChange }: ThumbnailItemProps) => {
    const { fileId, thumbnail, pageNumber, checked } = page;

    return (
        <div
        className="bg-custom-dark"
        draggable
        onDragStart={(event) => onDragStart(event, fileId)}
        >
        <img src={thumbnail} alt={`Thumbnail ${pageNumber}`} className="w-full h-auto rounded-lg" onError={(e) => console.log('Image failed to load:', thumbnail, e)} />
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckboxChange(fileId, pageNumber, e.target.checked)}
        />
        </div>
    );
};

export default ThumbnailItem;