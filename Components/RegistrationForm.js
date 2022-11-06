import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import React from 'react';
import {StyleSheet, Text, Linking} from "react-native";
import {useNavigation} from "@react-navigation/native";
import basicStyles from '../Styles'

export const RegistrationForm = () => {
  const navigation = useNavigation()
  const callback = async () => {
    //await Linking.openURL('http://t.me/vpn_pepa_bot?start=auth')
    await Linking.openURL('http://t.me/findTattooMaster_bot?start=auth')
    toLoginHandler()
  }

  const toLoginHandler = () => navigation.navigate('Login')

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{...basicStyles.label, ...styles.registerLogo}}>
        Регистрация
      </Text>
        <Button
          labelStyle={{color: 'white', fontSize: 17}}
          style={{...styles.loginButton, ...styles.mt10}}
          onPress={callback}
          icon={props =>  <Icon name="telegram" {...props} /> }
        >
        В телеграм
        </Button>
      <Button labelStyle={{color: '#D9550D', fontSize: 14}} style={styles.mt10} onPress={toLoginHandler}>Есть код? Залогинься здесь!</Button>
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
