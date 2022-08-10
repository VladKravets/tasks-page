import jwt from 'jsonwebtoken';

const STORAGE_KEYS = [
  'docstream-token',
  'docstream-user',
  'docstream-auth-expiration',
];

export const setInStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getFromStorage = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.log(`Unable to remove ${key} from storage.`);
  }
};

export const clearStorage = () => STORAGE_KEYS.forEach(removeFromStorage);

export const saveTokens = (authenticationToken, user) => {
  const { exp } = jwt.decode(authenticationToken);

  setInStorage('docstream-token', authenticationToken);
  setInStorage('docstream-user', user);
  setInStorage('docstream-auth-expiration', exp * 1000);
};
