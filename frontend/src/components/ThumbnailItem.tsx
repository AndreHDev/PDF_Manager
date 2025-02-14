import React from 'react';
import type { Page } from '../api/api';

interface ThumbnailItemProps {
  page: Page;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, fileID: string, pageNumber: number) => void;
  onCheckboxChange: (fileID: string, pageNumber: number, checked: boolean) => void;
}

const ThumbnailItem = ({ page, onDragStart, onCheckboxChange }: ThumbnailItemProps) => {
    const { file_id, thumbnail, page_number, checked } = page;

    return (
        <div
        className="bg-custom-dark"
        draggable
        data-file-id={page.file_id} 
        data-page-number={page.page_number}
        onDragStart={(event) => onDragStart(event, file_id, page_number)}
        >
        <img src={thumbnail} alt={`Thumbnail ${page_number}`} className="w-full h-auto rounded-lg" onError={(e) => console.log('Image failed to load:', thumbnail, e)} />
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckboxChange(file_id, page_number, e.target.checked)}
        />
        </div>
    );
};

export default ThumbnailItem;