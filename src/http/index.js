import axios from 'axios';

import { getFromStorage, clearStorage } from 'utils/storage';

const baseURL = process.env.REACT_APP_BASE_API || `${window.location.origin}/api`;

const http = axios.create({
  baseURL,
});

const beforeRequest = async (config) => {
  const authToken = getFromStorage('docstream-token');
  const authTokenExpirationDate = getFromStorage('docstream-auth-expiration');

  if (authTokenExpirationDate && authTokenExpirationDate < Date.now()) {
    clearStorage();
    window.location = '/login';
    return;
  }

  if (authToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authToken}`,
    };
  }

  return config;
};

http.interceptors.request.use(beforeRequest);

export default http;
