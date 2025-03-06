import { useDragAndDrop } from "../hooks/useDragAndDrop";
import type { Page } from '../api/api';
import ThumbnailItem from './ThumbnailItem';
import log from '../utils/logger';
import './ThumbnailGrid.css';

interface IProps {
    pages: Page[];
    onCheckBoxChange: (pageId: string, checked: boolean ) => void;
    insertPage: (draggedPageId: string, targetPageId: string) => void;
}

const ThumbnailGrid = ({ pages, onCheckBoxChange, insertPage }: IProps) => {

    const { handleDragStart, handleDragOver, handleDrop, targetPageId } = useDragAndDrop(insertPage);

    log.debug("Current Pages: ", pages);

    return (
      <div className="grid grid-cols-5 gap-4 mt-4 bg-custom-dark p-4" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {pages.map((page, index) => (
        <div
          key={index}
          data-page-id={page.page_id}
          data-page-number={index}
          onDragOver={(e) => handleDragOver(e, page.page_id)}
          className={`relative ${targetPageId === page.page_id ? 'drag-over' : ''}`}
        >
          <ThumbnailItem
            page={page}
            onDragStart={handleDragStart}
            onCheckboxChange={onCheckBoxChange}
          />
          {targetPageId === page.page_id && <div className="drag-indicator"></div>}
        </div>
      ))}
    </div>
    );
  };

export default ThumbnailGrid;