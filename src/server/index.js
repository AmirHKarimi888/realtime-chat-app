import axios from "axios";

class HttpService {
  constructor(baseURL) {
    this.url = baseURL.replace(/\/+$/, ""); // remove trailing slashes
  }

  buildUrl(endpoint) {
    return `${this.url}/${endpoint.replace(/^\/+/, "")}`; // remove leading slashes
  }

  async get(endpoint, headers) {
    return await axios.get(this.buildUrl(endpoint), {
      headers,
      withCredentials: true,
    });
  }

  async post(endpoint, body, headers) {
    return await axios.post(this.buildUrl(endpoint), body, {
      headers,
      withCredentials: true,
    });
  }

  async put(endpoint, body, headers) {
    return await axios.put(this.buildUrl(endpoint), body, {
      headers,
      withCredentials: true,
    });
  }

  async delete(endpoint, headers) {
    return await axios.delete(this.buildUrl(endpoint), {
      headers,
      withCredentials: true,
    });
  }
}

// usage
const httpService = new HttpService("http://localhost:4000");
export default httpService;
