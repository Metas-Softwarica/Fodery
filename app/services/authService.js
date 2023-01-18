import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { constants } from '../configs/constants';

export async function checkToken() {
  let tokens = await SecureStore.getItemAsync('tokens');
  if (tokens) {
    let res = await checkTokenStatus(JSON.parse(tokens));
    return res || false;
  }
  return false;
}

export async function login(axiosInstance, email, password) {
  try {
    let res = await axiosInstance.post('/user/login/', {
      email,
      password,
    });
    secureStoreToken(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function secureStoreToken(data) {
  await SecureStore.setItemAsync('tokens', JSON.stringify(data));
}

export async function signup(axiosInstance, obj) {
  try {
    let res = await axiosInstance.post('/user/register/', obj);
    return {
      message: res.data,
      status: true,
    };
  } catch (error) {
    console.log(error.response.data.detail);
    return {
      message: error.response.data.detail,
      status: false,
    };
    // return false;
  }
}

export async function forgetPassword(axiosInstance, obj) {
  try {
    let res = await axiosInstance.post('/user/forgot_password', obj);
    return {
      message: res.data,
      status: true,
    };
  } catch (error) {
    console.log(error.response);
    console.log(error.response.data.detail);
    return {
      message: error.response.data.detail,
      status: false,
    };
    // return false;
  }
}

export async function logout() {
  try {
    await SecureStore.deleteItemAsync('tokens');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function checkPhoneVerification(axiosInstance) {
  try {
    let res = await axiosInstance.get('user/check_phone_verification', {});
  } catch (error) {
    console.log(error, 'checkPhoneVerification');
  }
}

export async function requestOTP(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('user/verify_phone', payload);
    return res;
  } catch (error) {
    console.log(error, 'requestOTP');
    return error;
  }
}

export async function verifyOTP(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('user/verify_code', payload);
  } catch (error) {
    console.log(error, 'verifyOTP');
    return false;
  }
}

export async function updatePassword(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('user/updatePassword/', payload);
    return true;
  } catch (error) {
    console.log(error, 'changePassword');
    return false;
  }
}

export async function setPasswordSocial(axiosInstance, payload) {
  try {
    await axiosInstance.post('user/setPassword/', payload);
    return true;
  } catch (error) {
    console.log(error, 'setPasswordSocial');
    return false;
  }
}

export async function checkPasswordEmpty(axiosInstance) {
  try {
    let res = await axiosInstance.get('user/passwordEmpty/');
    return res.data;
  } catch (error) {
    console.log(error, 'checkPasswordEmpty');
    return false;
  }
}

async function checkTokenStatus(tokens) {
  let accessExpired = false;
  try {
    await axios.get(`${constants.baseURL}order/getCart/`, {
      headers: {
        token: tokens.access_token,
      },
    });
    return tokens;
  } catch (error) {
    console.log(error);
    if (error && error.response && error.response.status === 406) {
      accessExpired = true;
    }
  }
  if (accessExpired) {
    try {
      let res = await axios.post(`${constants.baseURL}user/getNewAccess/`, {
        refresh_token: tokens.refresh_token,
      });
      let resTokens = {
        ...res.data,
        refresh_token: tokens.refresh_token,
      };
      return resTokens;
    } catch (error) {
      return false;
    }
  }
  return false;
}
