import React from 'react';
import {ScrollView, Linking} from 'react-native'
import {CommodityCard} from "../Components/CommodityCard";
import {subscribes} from "../Utils/consts";
import {useAuth} from "../Contexts/AuthContext";
import styles from '../Styles'
import {RateUsDialogue} from "../Components/RateUsDialogue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {axiosInstance} from "../services/axiosInstance";
import {statusPoller, successCallback} from "../Utils/helpers";
import Toast from "react-native-toast-message";


export const ShoppingCartScreen = () => {
  const {authData, setUser} = useAuth()
  const [isDialogueVisible, setDialogueIsVisible] = React.useState(false)
  const toggleDialogue = () => setDialogueIsVisible(prev => !prev)

  const beforeAll = (data) => {
    setUser(data.client)
  }

  const afterSuccess = () => {
    AsyncStorage.getItem('feedback').then(hasFeedback => {
      if (!hasFeedback) {
        toggleDialogue()
      }
    })
  }

  const onBuyHandler = (subscribe, telegramId) => async () => {
    if (subscribe.text === '1 год') {
      return Toast.show({
        type: 'warning',
        text1: 'Нет ну серьезно, мы же сказали не продаем',
        text2: 'Купи 2 раза по полгода, как тебе сделка?',
        visibilityTime: 8000
      })
    }
    try {
      const {data: paymentDetails} = await axiosInstance.post('createNewBill', {subscribe, telegramId })
      await AsyncStorage.setItem('pollingBillId', paymentDetails.billId)
      statusPoller(telegramId, paymentDetails.billId, successCallback(beforeAll, afterSuccess))
      await Linking.openURL(paymentDetails.payUrl)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <ScrollView style={styles.secondaryPageContainer}>
      <RateUsDialogue
        isDialogueVisible={isDialogueVisible}
        hideDialogue={toggleDialogue}
      />
      { Object.keys(subscribes).map(s => (
        <CommodityCard key={s} subscribe={subscribes[s]} handler={onBuyHandler(subscribes[s], authData.telegramId)} />
      ))}
    </ScrollView>
  )
}
