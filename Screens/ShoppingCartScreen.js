import React from 'react';
import {ScrollView, Linking} from 'react-native'
import {CommodityCard} from "../Components/CommodityCard";
import {useAuth} from "../Contexts/AuthContext";
import styles from '../Styles'
import {RateUsDialogue} from "../Components/RateUsDialogue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API} from "../services/axiosInstance";
import {statusPoller} from "../Utils/helpers";
import Toast from "react-native-toast-message";
import {useFocusEffect} from "@react-navigation/native";

const messages = {
  1: {
    text1: 'Нет ну серьезно, мы же сказали не продаем',
    text2: 'Купи 2 раза по полгода, как тебе сделка?',
  },
  2: {
    text1: 'Не вынуждай нас завышать цену',
    text2: 'Мы правда не хотим этого делать',
  },
  3: {
    text1: 'Последнее предупреждение иначе цена 3000р',
    text2: 'Ты правда этого хочешь?',
  }
}


export const ShoppingCartScreen = () => {
  const {authData, setUser, config} = useAuth()
  const [isDialogueVisible, setDialogueIsVisible] = React.useState(false)
  const toggleDialogue = () => setDialogueIsVisible(prev => !prev)
  const myRef = React.useRef(0)

  useFocusEffect(
    React.useCallback(() => {
      myRef.current = 0
    }, [])
  )

  const showRateUsModal = () => {
    AsyncStorage.getItem('feedback').then(hasFeedback => {
      if (!hasFeedback) {
        toggleDialogue()
      }
    })
  }

  const onBuyHandler = (subscribe, telegramId) => async () => {
    if (subscribe.text === '1 год') {
      if (myRef.current < 3) {
        myRef.current += 1
        return Toast.show({
          type: 'warning',
          ...messages[myRef.current],
          visibilityTime: 5000
        })
      }
      myRef.current = 0
    }
    try {
      const paymentDetails = await API.createNewBill(subscribe, telegramId)
      await AsyncStorage.setItem('pollingBillId', paymentDetails.billId)
      await statusPoller(telegramId, paymentDetails.billId, setUser, showRateUsModal)
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
      { Object.keys(config.tariffs).map(s => (
        <CommodityCard
          key={s}
          subscribe={s === '1 год' ? {...config.tariffs[s], price: '???' } : config.tariffs[s]}
          handler={onBuyHandler(config.tariffs[s], authData.telegramId)}
        />
      ))}
    </ScrollView>
  )
}
