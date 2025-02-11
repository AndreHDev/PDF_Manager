
import { useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import { api } from '../api/myApi';

interface IProps {
  onUploadSuccess: (fileId: string) => void;
}

function UploadDialog({onUploadSuccess}: IProps) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    
    const uploadFile = async (file:File) => {
      try {
        const response = await api.uploadFileUploadPost(file);
        console.log(response);
        if (response.data && response.data.file_id) {
          onUploadSuccess(response.data.file_id);
        }
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }

    acceptedFiles.forEach(file => {
      uploadFile(file);
    });

  }, [acceptedFiles, onUploadSuccess]);

  
  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default UploadDialog;