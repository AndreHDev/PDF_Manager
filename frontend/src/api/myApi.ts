// Create connection to the backend API
import { Configuration, DefaultApi } from "./index";

const config = new Configuration({ basePath: "http://localhost:8000" });
// Delete the User-Agent header, to not reveal sensitive information
delete config.baseOptions.headers["User-Agent"];
const api = new DefaultApi(config);

export { api };
