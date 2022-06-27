import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import {Button, TextInput} from "react-native-paper";
import React from 'react';
import {StyleSheet, Text, Linking} from "react-native";
import {useAuth} from "../Contexts/AuthContext";
import basicStyles from '../Styles'
import Icon from "react-native-vector-icons/FontAwesome";

export const LoginForm = () => {
  const [code, setCode] = React.useState('')
  const toTelegram = async () => await Linking.openURL('http://t.me/vpn_pepa_bot?start=auth')
  const { signIn } = useAuth()

  const login = async () => {
    if (code.length >= 5) {
      await signIn(code)
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
        mode="contained"
        labelStyle={{color: 'white', fontSize: 17}}
        style={{...styles.loginButton, ...styles.mt10}}
        onPress={login}
        color={code.length < 5 ? 'gray' : '#D9550D'}
      >
        Войти
      </Button>
      <Button
        labelStyle={{color: '#D9550D', fontSize: 16}}
        style={styles.mt10}
        onPress={toTelegram}
        icon={props => <Icon style={{ fontSize: 25}} name="telegram" {...props} /> }
      >
        Получи код здесь!
      </Button>
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
    marginVertical: 10,
    padding: 10,
  },
  registerLogo: {
    color: '#D9550D',
    alignSelf: 'center'
  },
})
