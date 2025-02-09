
import { useEffect } from 'react';
import {useDropzone} from 'react-dropzone';
import { api } from '../api/myApi';


function UploadDialog() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

  async function uploadFile(file: File) {
    const response = await api.uploadFileUploadPost(file);
    console.log(response);
  }  
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    acceptedFiles.forEach(file => {
      uploadFile(file);
    });
  }, [acceptedFiles]);

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