import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://192.168.88.244:4000', // change this to your IP on same Wi-Fi
  headers: { 'Content-Type': 'application/json' },
});
