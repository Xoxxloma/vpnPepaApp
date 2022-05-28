import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import {Button, TextInput} from "react-native-paper";
import React from 'react';
import {StyleSheet, Text, View, Linking} from "react-native";
import {useNavigation} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import {useAuth} from "../Contexts/AuthContext";
import basicStyles from '../Styles'

export const LoginForm = () => {
  const navigation = useNavigation()
  const [code, setCode] = React.useState('')
  const toRegisterHandler = async () => navigation.navigate('Registration')
  const { signIn, error } = useAuth()

  const login = async() => {
    try {
      await signIn(code)
    } catch (e) {
      Toast.show({type: 'error', text1: 'Ошибка логина, попробуйте снова или перезагрузите приложение!'})
    }

  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{...basicStyles.label, ...styles.registerLogo}}>
        Логин
      </Text>
      <TextInput
        label="Код авторизации из telegram"
        value={code}
        mode="flat"
        onChangeText={(e) => setCode(e)}
        activeUnderlineColor="#D9550D"
        style={styles.mt10}
      />
      <Button
        labelStyle={{color: 'white', fontSize: 17}}
        style={{...styles.loginButton, ...styles.mt10}}
        onPress={login}
      >
        Войти
      </Button>
      <Button labelStyle={{color: '#D9550D', fontSize: 14}} style={styles.mt10} onPress={toRegisterHandler}>Нет кода? Зарегистрируйся здесь!</Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 20
  },
  mt10: {
    marginTop: 10
  },
  loginButton: {
    backgroundColor: '#D9550D',
    color: 'white',
    padding: 10,
  },
  registerLogo: {
    color: '#D9550D',
    alignSelf: 'center'
  }
})
