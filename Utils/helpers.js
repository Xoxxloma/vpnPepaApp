import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import {axiosInstance} from "../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
dayjs.extend(isSameOrBefore)

export const formatDate = (date) => dayjs(date).format("DD.MM.YYYY")

export const shouldUpdateAuthData = (date) => {
  return dayjs(date).isSameOrBefore(dayjs(), 'day');
}

export const statusPoller = async (telegramId, billId, successCallback) => {

  try {
    const statusResponse = await axiosInstance.get('pollPaymentStatus', {params: { billId }})
    console.log(statusResponse.data.value)
    if (statusResponse.data.value === "WAITING") {
      return setTimeout(() => statusPoller(telegramId, billId, successCallback), 10000)
    } else {
      const clientResponse = await axiosInstance.post('savePayment', {telegramId, status: statusResponse.data})
      await AsyncStorage.removeItem('pollingBillId')
      await successCallback(clientResponse.data)
    }
  } catch (e) {
    console.log(e, 'error')
  }
}

export const successCallback = (beforeAll, afterPaid) => async (data) => {
  beforeAll(data)
  if (data.status === "PAID") {
    Toast.show({type: 'success', text1: 'Оплата произведена успешно.', text2: 'Приятного пользования!', visibilityTime: 6000})
    if (Boolean(afterPaid)) afterPaid()
  }
  if (data.status === "EXPIRED") {
    Toast.show({type: 'info', text1: 'Срок оплаты истек.', text2: 'В случае необходимости - повторите попытку', visibilityTime: 6000})
  }
  if (data.status === "REJECTED") {
    Toast.show({ type: 'error', text1: 'Ошибка!', text2: 'Попробуйте снова или обратитесь в поддержку.', visibilityTime: 6000 })
  }
}

