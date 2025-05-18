import axios from 'axios';

const BASE_URL = 'http://10.3.2.209:8000'; // ✅ Your correct IP

export const login = (data) => axios.post(`${BASE_URL}/traditional/login`, data);

export const verifyOTP = (data) => axios.post(`${BASE_URL}/traditional/verify-otp`, data);

export const traditionalTransaction = (data, token) =>
  axios.post(`${BASE_URL}/traditional/transaction`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const authenticateAANF = (deviceInfo = {}) =>
  axios.post(`${BASE_URL}/aanf/authenticate`, deviceInfo);

export const aanfTransaction = (data, akmaKey) =>
  axios.post(`${BASE_URL}/aanf/transaction`, data, {
    headers: { 'x-akma-key': akmaKey },
  });
