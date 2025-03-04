// Create connection to the backend API
import { Configuration, DefaultApi } from "./index";

// Use environment variable or fallback to current domain
const basePath =
  process.env.REACT_APP_API_BASE_PATH ||
  `${window.location.protocol}//${window.location.hostname}:${8000}`;

const config = new Configuration({ basePath: basePath });
// Delete the User-Agent header, to not reveal sensitive information
delete config.baseOptions.headers["User-Agent"];
const api = new DefaultApi(config);

export { api };
