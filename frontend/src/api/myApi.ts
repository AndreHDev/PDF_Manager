// Create connection to the backend API
import { Configuration, DefaultApi } from "./index";

// Change the base path to the backend API if you want to host on server
const config = new Configuration({ basePath: "http://localhost:8000" });

// Delete the User-Agent header, to not reveal sensitive information
delete config.baseOptions.headers["User-Agent"];
const api = new DefaultApi(config);

export { api };
