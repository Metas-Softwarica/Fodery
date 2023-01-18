export async function placeOrder(axiosInstance, obj) {
  try {
    let res = await axiosInstance.post('order/addOrder/', obj);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getPendingOrder(axiosInstance) {
  try {
    let res = await axiosInstance.get('order/get_pending_order/');
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCompletedOrder(axiosInstance) {
  try {
    let res = await axiosInstance.get('order/get_completed_order/');
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getOrderDetail(axiosInstance, id) {
  try {
    let res = await axiosInstance.get(`order/getOrder/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function convertToFixed(data) {
  if (typeof data !== 'number' && !data) {
    return '--';
  }
  if (typeof data === 'number') {
    data = data.toFixed(2);
  }
  return data;
}
