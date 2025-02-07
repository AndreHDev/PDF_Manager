import {useDropzone} from 'react-dropzone';
import { DefaultApi } from '../api';

import { Configuration } from '../api';

const config = new Configuration({ basePath: "http://localhost:8000" });
const api = new DefaultApi(config);

function UploadDialog() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  //for every file, call the uploadFile function
  acceptedFiles.forEach(file => {
    uploadFile(file);
  });

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

async function uploadFile(file: File) {
  const response = await api.uploadFileUploadPost(file);
  console.log(response);
}

export default UploadDialog;