import * as SecureStore from 'expo-secure-store';

export async function registerFirstOpen() {
  await SecureStore.setItemAsync('first_open', new Date().toDateString());
}

export async function isFirstOpen() {
  let result = await SecureStore.getItemAsync('first_open');
  return !result;
}

export async function getAboutDetails(axiosInstance) {
  try {
    let result = await axiosInstance.get('settings/getAppInfo/');
    return result.data;
  } catch (error) {
    console.log(error, 'getAboutDetails');
    return false;
  }
}

export async function getUserFeed(axiosInstance) {
  try {
    let res = await axiosInstance.get('general/get_feed');
    return res.data;
  } catch (error) {
    console.log(error, 'getUserFeed');
    return false;
  }
}
export async function getMoreUserFeed(axiosInstance, url) {
  try {
    let res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.log(error, 'getUserFeed');
    return false;
  }
}
export async function getStates(axiosInstance) {
  try {
    let res = await axiosInstance.get('general/state/');
    return res.data;
  } catch (error) {
    console.log(error, 'getStates');
    return false;
  }
}

export async function getCities(axiosInstance) {
  try {
    let res = await axiosInstance.get('general/city/');
    return res.data;
  } catch (error) {
    console.log(error, 'getStates');
    return false;
  }
}
