import React from 'react';
import type { Page } from '../api/api';

interface ThumbnailItemProps {
  page: Page;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, pageId: string) => void;
  onCheckboxChange: (pageID: string, checked: boolean) => void;
}

const ThumbnailItem = ({ page, onDragStart, onCheckboxChange }: ThumbnailItemProps) => {
    const { page_id, thumbnail, page_number, checked } = page;

    return (
        <div
        className="bg-custom-dark"
        draggable
        data-file-id={page.page_id} 
        data-page-number={page.page_number}
        onDragStart={(event) => onDragStart(event, page_id)}
        >
        <img src={thumbnail} alt={`Thumbnail ${page_number}`} className="w-full h-auto rounded-lg" onError={(e) => console.log('Image failed to load:', thumbnail, e)} />
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckboxChange(page_id, e.target.checked)}
        />
        </div>
    );
};

export default ThumbnailItem;