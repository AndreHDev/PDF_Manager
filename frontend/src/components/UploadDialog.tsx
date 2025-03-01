
import { useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import { api } from '../api/myApi';
import log from '../utils/logger';

interface IProps {
  onUploadSuccess: (fileid: string ) => void;
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
      log.debug('Uploading file:', file);
      try {
        const response = await api.uploadPdf(file);
        log.debug('Upload response:', response);
        if (response.data && (response.data as { file_id: string })) {
          onUploadSuccess((response.data as { file_id: string }).file_id);
        }
      } catch (error) {
        log.error('Error uploading files:', error);
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