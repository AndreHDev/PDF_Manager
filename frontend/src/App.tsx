import './App.css'
import UploadDialog from './components/UploadDialog';
import ThumbnailGrid from './components/ThumbnailGrid';
import MergeButton from './components/MergeButton';
import { usePdfManager } from "./hooks/usePdfManager";

const App = () => {
  const { pages, handleUploadSuccess, handleCheckboxChange, handleInsertPage } = usePdfManager();

  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-custom-dark min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">PDF Merge App</h1>
      <UploadDialog onUploadSuccess={handleUploadSuccess}/>
      <ThumbnailGrid pages={pages} onCheckBoxChange={handleCheckboxChange} insertPage={handleInsertPage} />
      <MergeButton pages={pages} />
    </div>
  );
};

export default App
