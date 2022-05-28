import React from 'react';
import {ScrollView, Linking} from 'react-native'
import {CommodityCard} from "../Components/CommodityCard";
import axios from "axios";
import {subscribes} from "../Utils/consts";
import {useAuth} from "../Contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import BackgroundTimer from 'react-native-background-timer'
import styles from '../Styles'


const statusPoller = async (telegramId, billId, successCallback) => {

  BackgroundTimer.runBackgroundTimer(async () => {
    try {
      const statusResponse = await axios.get('http://185.105.108.208:4003/pollPaymentStatus', {params: { billId }})
      if (statusResponse.data.value !== "WAITING") {
        BackgroundTimer.stopBackgroundTimer()
        const clientResponse = await axios.post('http://185.105.108.208:4003/savePayment', {telegramId, status: statusResponse.data})
        successCallback(clientResponse.data)
      }
    } catch (e) {
      BackgroundTimer.stopBackgroundTimer()
    }
  }, 10000)
}


export const ShoppingCartScreen = () => {
  const {authData, setUser} = useAuth()
  const navigation = useNavigation()

  const successCallback = (data) => {
    setUser(data.client)
    navigation.navigate('MainPage')
    if (data.status === "PAID") {
      Toast.show({type: 'success', text1: 'Оплата произведена успешно.', text2: 'Приятного пользования!'})
    }
  }

  const onBuyHandler = (subscribe, telegramId) => async () => {
    try {
      const {data: paymentDetails} = await axios.post('http://185.105.108.208:4003/createNewBill', {subscribe, telegramId })
      statusPoller(telegramId, paymentDetails.billId, successCallback)
      await Linking.openURL(paymentDetails.payUrl)
      // successCallback({client: {...authData, telegramId: 666666, certificate: ''}})

    } catch (e) {
      console.log(e)
    }
  }

  return (
    <ScrollView style={styles.secondaryPageContainer}>
      { Object.keys(subscribes).map(s => (
        <CommodityCard key={s} subscribe={subscribes[s]} handler={onBuyHandler(subscribes[s], authData.telegramId)} />
      ))}
    </ScrollView>
  )
}
