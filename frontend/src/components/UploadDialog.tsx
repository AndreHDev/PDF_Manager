
import { useEffect} from 'react';
import {useDropzone} from 'react-dropzone';
import { api } from '../api/myApi';
import log from '../utils/logger';
import './UploadDialog.css';

interface IProps {
  onUploadSuccess: (fileid: string ) => void;
}

function UploadDialog({onUploadSuccess}: IProps) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

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
        <div className="plus-sign">+</div>
        <p>Drag 'n' drop some files here, or click to select files.</p>
      </div>
    </section>
  );
}

export default UploadDialog;