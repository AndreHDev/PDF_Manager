//import { useState } from 'react'

import './App.css'
import UploadDialog from './components/UploadDialog';

const App: React.FC = () => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">PDF Merge App</h1>
      <UploadDialog/>
    </div>
  );
};

export default App
