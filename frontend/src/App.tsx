import { useState, useCallback } from 'react'
import './App.css'
import UploadDialog from './components/UploadDialog';
import ThumbnailGrid from './components/ThumbnailGrid';

const App: React.FC = () => {
  const [fileIds, setFileIds] = useState<string[]>([]);

  const handleUploadSuccess = useCallback((fileID: string) => {
    console.log("Upload complete:", fileID);
    setFileIds(prevFileIds => [...prevFileIds, fileID]);
  }, []);

  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-gray-100 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">PDF Merge App</h1>
      <UploadDialog onUploadSuccess={handleUploadSuccess}/>
      <ThumbnailGrid fileIds={fileIds}/>
    </div>
  );
};

export default App
