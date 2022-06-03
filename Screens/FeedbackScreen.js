import React from 'react';
import {Text, StyleSheet, SafeAreaView} from 'react-native'
import basicStyles from '../Styles'
import {Button, TextInput} from "react-native-paper";
import axios from "axios";
import Toast from "react-native-toast-message";
import {useAuth} from "../Contexts/AuthContext";
import {MessageList} from "../Components/MessageList";
import dayjs from "dayjs";


export const FeedbackScreen = () => {
  const [textToSupport, setTextToSupport] = React.useState('')
  const { authData: { telegramId, name, authCode, messageList}, signIn, setAuthData } = useAuth()

  React.useEffect(() => {
    signIn(authCode)
  }, [])

  const textToSupportHandler = (e) => setTextToSupport(e)
  const onSendMessageToSupport = async () => {
    if (textToSupport.length < 5 || textToSupport.length > 1000) return
    try {
      const {data} = await axios.post('http://185.105.108.208:4003/messageToSupport', { sender: name, telegramId, timestamp: dayjs(), text: textToSupport })
      setAuthData( prev => ({ ...prev, messageList: data }))
      setTextToSupport('')
      Toast.show({type: 'success', text1: 'Запрос в поддержку отправлен.', text2: 'Мы свяжемся с вами в течение 48 часов'})
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Ошибка отправки, попробуйте позже.' })
    }
  }

  const memoizedList = React.useMemo(() => <MessageList messages={messageList} />, [messageList.length] )

  return (
    <SafeAreaView style={basicStyles.secondaryPageContainer}>
      <Text style={{color: '#D9550D', marginVertical: 20, fontSize: 17}}>
        Заполните форму ниже и мы обязательно ответим Вам в течение 48 часов.
      </Text>
      <TextInput
        label="Запрос в поддержку"
        right={<TextInput.Affix text={`${textToSupport.length}/1000`} /> }
        value={textToSupport}
        multiline={true}
        numberOfLines={5}
        onChangeText={textToSupportHandler}
        activeUnderlineColor="#D9550D"
      />
      <Button
        mode="contained"
        labelStyle={{color: 'white', fontSize: 20}}
        style={styles.sendButton}
        onPress={onSendMessageToSupport}
        color={textToSupport.length < 5 ? 'gray' : '#D9550D'}
      >
        Отправить
      </Button>
      {memoizedList}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sendButton: {
    marginVertical: 10,
    padding: 10,
  },
})
