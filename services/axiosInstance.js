import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'http://pepavpn.ru:4003/'
  // baseURL: 'http://192.168.0.103:4003/'
})

class ApiHelper {
  getClientByAuthCode = async (authCode) => {
    const {data} = await axiosInstance.get(`getClientByAuthCode/${authCode}`)
    return data;
  }

  getConfig = async () => {
    const {data: configData} = await axiosInstance.get('getConfig')
    return configData
  }

  getMessageList = async (telegramId) => {
    const { data: messageList } = await axiosInstance.get('/messageList', { params: { telegramId } } )
    return messageList
  }

  sendMessageToSupport = async (sender, telegramId, timestamp, text) => {
    const {data} = await axiosInstance.post('messageToSupport', { sender, telegramId, timestamp, text })
    return data;
  }

  createNewBill = async (subscribe, telegramId) => {
    const {data: paymentDetails} = await axiosInstance.post('createNewBill', {subscribe, telegramId })
    return paymentDetails
  }

  getNews = async () => {
    const { data: news } = await axiosInstance.get('news')
    return news;
  }

  getUserStatistics = async (telegramId) => {
    const {data: statistics } = await axiosInstance.get(`userStatistics/${telegramId}`)
    return statistics;
  }

  getPollingStatus = async (billId) => {
    const {data: status} = await axiosInstance.get('pollPaymentStatus', {params: { billId }})
    return status;
  }

  saveClientPayment = async (telegramId, status) => {
    const {data: clientResponse} = await axiosInstance.post('savePayment', {telegramId, status})
    return clientResponse
  }

  setAppVersion = async (telegramId, version) => {
    await axiosInstance.get('setAppVersion', {params: {telegramId, version}})
  }

  getCurrentIp = async () => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000)
    const { data } = await axios.get('https://api.ipify.org/', {signal: controller.signal})
    return data;
  }
}

export const API = new ApiHelper();
