import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'http://185.105.108.208:4003/'
})
