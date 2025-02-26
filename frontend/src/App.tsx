import { useState, useCallback, useEffect } from 'react'
import './App.css'
import UploadDialog from './components/UploadDialog';
import ThumbnailGrid from './components/ThumbnailGrid';
import type { Page } from './api/api';
import MergeButton from './components/MergeButton';
import { api } from './api/myApi';

const App = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const getPdfPages = async (file_id: string) => {
    try {
      const response = await api.getPdfPages(file_id);
      return response.data;
    }
    catch (error) {
      console.error('Error getting pages:', error);
      return [];
    }
  };
  
  const handleUploadSuccess = useCallback((file_id: string) => {
    const fetchPages = async () => {
      const new_pages = await getPdfPages(file_id);
      setPages(prevPages => [...prevPages, ...new_pages]);
    };

    fetchPages();
  }, []);

  const handleCheckBoxChange = useCallback((pageId: string, checked: boolean) => {
    // Search for given page and update its checked status
    setPages(prevPages => prevPages.map(page => {
      if (page.page_id === pageId) {
        return {
          ...page,
          checked
        };
      }
      return page;
    }));
  }, []);

  const handleSwapPages = useCallback((draggedPageId: string, targetPageId: string) => {
    setPages(prevPages => {
      const draggedIndex = prevPages.findIndex(p => p.page_id === draggedPageId);
      const targetIndex = prevPages.findIndex(p => p.page_id === targetPageId);
      console.log('Dragged index:', draggedIndex, 'Target index:', targetIndex);
      
      if (draggedIndex === -1 || targetIndex === -1) return prevPages;
      
      const newPages = [...prevPages];
      // Swap the pages
      [newPages[draggedIndex], newPages[targetIndex]] = [newPages[targetIndex], newPages[draggedIndex]];
      
      return newPages;
    });
  }, []);

  useEffect(() => {
    const cleanup = async () => {
      const response = await api.cleanUpTempFiles();
      console.log('Cleanup response:', response);
    };

    // Cleanup backend on page unload
    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
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
