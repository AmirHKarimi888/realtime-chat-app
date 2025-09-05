import axios from "axios";

class httpService {

    constructor(url) {
        this.url = url;
    }

    async get(endpoint, headers) {
        return await axios.get(`${this.url}/${endpoint}`, {
            headers: headers,
            withCredentials: true
        })
    }

    async post(endpoint, body, headers) {
        return await axios.post(`${this.url}/${endpoint}`, body, {
            headers: headers,
            withCredentials: true
        });
    }
}

export default new httpService("http://localhost:4000");