import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./env";
import { defaults, DEVICE_TOKEN } from "./storageKeys";

/**
 * Save a string to storage
 * 
 * @param key key to save to async storage
 * @returns a promise that is rejected if there was an error saving from storage
 *            and resolves if saving was succesful 
 */
export const saveString = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    return Promise.reject("Error Saving");
  }
}

/**
 * Save a number to storage
 * 
 * @param key key to save to async storage
 * @returns a promise that is rejected if there was an error saving from storage
 *            and resolves if saving was succesful 
 */
export const saveNumber = async (key: string, value: number): Promise<void> => {
  return saveString(key, `${value}`);
}

/**
 * Save an object to storage
 * 
 * @param key key to save to async storage
 * @returns a promise that is rejected if there was an error saving from storage
 *            and resolves if saving was succesful 
 */
export const saveObject = async (key: string, value: object): Promise<void> => {
  return saveString(key, JSON.stringify(value));
}

/**
 * Load a string from storage
 * 
 * @param key key to load from async storage
 * @returns a promise that is rejected if there was an error loading from storage
 *            or if the key was not in storage and resolves to a string value if 
 *            loading was succesful 
 */
export const loadString = async (key: string): Promise<string> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    else {
      const defaultValue = defaults.get(key);
      if (key === DEVICE_TOKEN) {
        return requestToken()
          .then((token) => {
            saveString(DEVICE_TOKEN, token)
            return token;
          })
      }
      else if (defaultValue) {
        saveString(key, defaultValue);
        return defaultValue;
      }
      return Promise.reject(`Key ${key} not found in storage or defaults`);
    }
  } catch (e) {
    return Promise.reject("Error loading");
  }
}

/**
 * Load a number from storage
 * 
 * @param key key to load from async storage
 * @returns a promise that is rejected if there was an error loading from storage
 *            or if the key was not in storage and resolves to a string value if 
 *            loading was succesful 
 */
export const loadNumber = async (key: string): Promise<number> => {
  const value = await loadString(key);
  const num = parseFloat(value);
  return Math.trunc(num) === num ? parseInt(value) : num;
}

/**
 * Load an object from storage
 * 
 * @param key key to load from async storage
 * @returns a promise that is rejected if there was an error loading from storage
 *            or if the key was not in storage and resolves to an object of type T
 *            if the loading was successful 
 */
export const loadObject = async <T extends object>(key: string): Promise<T> => {
  return JSON.parse(await loadString(key));
}

/**
 * Remove an item from storage
 * 
 * @param key key to remove from async storage
 * @returns a promise that is rejected if there was an error removing from storage 
 */
export const removeKey = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    return Promise.reject("Error removing tiem");
  }
}

const requestToken = async (): Promise<string> => {
  return fetch(API_URL + '/new-device-token/')
    .then((response) => response.json())
    .then((data) => data.device_token);
}