export async function getUserAddresses(axiosInstance) {
  try {
    let res = await axiosInstance.get('user/get_user_address');
    let array = res.data.results.map((item) => {
      let obj = { ...item, value: item.id };
      return obj;
    });
    return array;
  } catch (error) {
    return false;
  }
}

export async function getUserDetails(axiosInstance) {
  try {
    return (await axiosInstance.get('user/get_user/')).data;
  } catch (error) {
    return false;
  }
}

export async function addUserAddress(axiosInstance, address) {
  try {
    let res = await axiosInstance.post('user/addAddress/', address);
    return res;
  } catch (error) {
    return false;
  }
}

export async function updateUserAddress(axiosInstance, address) {
  try {
    let res = await axiosInstance.post(
      'user/updateDeleteAddress/' + address.id + '/',
      address
    );
    return res;
  } catch (error) {
    return false;
  }
}

export async function deleteUserAddress(axiosInstance, id) {
  try {
    let res = await axiosInstance.delete(
      'user/updateDeleteAddress/' + id + '/'
    );
    return res;
  } catch (error) {
    return false;
  }
}

export async function getUserProfile(axiosInstance) {
  try {
    let res = await axiosInstance.get('user/getUserProfile/');
    return res.data;
  } catch (error) {
    return false;
  }
}

export async function updateUserProfile(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('user/updateProfile/', payload);
    return res.data;
  } catch (error) {
    return false;
  }
}
