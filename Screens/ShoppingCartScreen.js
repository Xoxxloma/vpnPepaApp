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
import {useIsFocused} from "@react-navigation/native";

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
  const {authData, setUser} = useAuth()
  const [isDialogueVisible, setDialogueIsVisible] = React.useState(false)
  const toggleDialogue = () => setDialogueIsVisible(prev => !prev)
  const myRef = React.useRef(0)
  const isFocused = useIsFocused()

  React.useEffect(() => {
    myRef.current = 0
  }, [isFocused])

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
        <CommodityCard
          key={s}
          subscribe={s === '1 год' ? {...subscribes[s], price: '???' } : subscribes[s]}
          handler={onBuyHandler(subscribes[s], authData.telegramId)}
        />
      ))}
    </ScrollView>
  )
}
