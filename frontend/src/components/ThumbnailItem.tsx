import React from 'react';
import type {Page} from "./ThumbnailGrid"

interface ThumbnailItemProps {
  page: Page;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, pageNumber: number) => void;
  onCheckboxChange: (thumbnail: string, checked: boolean) => void;
}

const ThumbnailItem = ({ page, onDragStart, onCheckboxChange }: ThumbnailItemProps) => {
    const { fileId, thumbnail, pageNumber } = page;

    return (
        <div
        className="bg-custom-dark"
        draggable
        onDragStart={(event) => onDragStart(event, pageNumber)}
        >
        <img src={thumbnail} alt={`Thumbnail ${pageNumber}`} className="w-full h-auto rounded-lg" onError={(e) => console.log('Image failed to load:', thumbnail, e)} />
        <input
            type="checkbox"
            onChange={(e) => onCheckboxChange(fileId, e.target.checked)}
        />
        </div>
    );
};

export default ThumbnailItem;