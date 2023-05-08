import axios from "axios";

const fetchAPI = axios.create({
  baseURL: `http://localhost:4000/`,
});

export default fetchAPI;
