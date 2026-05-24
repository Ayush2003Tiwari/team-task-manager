import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-production-f2ec.up.railway.app",
});

export default API;