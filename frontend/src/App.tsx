import { useState, useCallback } from 'react'
import './App.css'
import UploadDialog from './components/UploadDialog';
import ThumbnailGrid from './components/ThumbnailGrid';
import type { Page } from './api/api';
import MergeButton from './components/MergeButtom';

const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const handleUploadSuccess = useCallback((pages: Page[]) => {
    setPages(prevPages => [...prevPages, ...pages]);
    console.log("Upload complete, current pages:", pages);
  }, []);

  const handleCheckBoxChange = useCallback((fileId: string, pageNumber: number, checked: boolean) => {
    // Search for given page and update its checked status
    setPages(prevPages => prevPages.map(page => {
      if (page.file_id === fileId && page.page_number === pageNumber) {
        return {
          ...page,
          checked
        };
      }
      return page;
    }));
  }, []);

  const handleSwapPages = useCallback((draggedPage: { fileId: string, pageNumber: number }, targetPage: { fileId: string, pageNumber: number }) => {
    setPages(prevPages => {
      const newPages = [...prevPages];
      const draggedPageIndex = newPages.findIndex(page => page.file_id === draggedPage.fileId && page.page_number === draggedPage.pageNumber);
      const targetPageIndex = newPages.findIndex(page => page.file_id === targetPage.fileId && page.page_number === targetPage.pageNumber);
      if (draggedPageIndex !== -1 && targetPageIndex !== -1) {
        [newPages[draggedPageIndex], newPages[targetPageIndex]] = [newPages[targetPageIndex], newPages[draggedPageIndex]];
      }
      return newPages;
    });
  }, []);

  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-custom-dark min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">PDF Merge App</h1>
      <UploadDialog onUploadSuccess={handleUploadSuccess}/>
      <ThumbnailGrid pages={pages} onCheckBoxChange={handleCheckBoxChange} swapPages={handleSwapPages} />
      <MergeButton pages={pages} />
    </div>
  );
};

export default App
