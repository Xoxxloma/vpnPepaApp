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
    await Linking.openURL('http://t.me/vpn_pepa_bot?start=auth')
    toLoginHandler()
  }

  const toLoginHandler = () => navigation.navigate('Login')

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{...basicStyles.label, ...styles.registerLogo}}>
        Registration
      </Text>
        <Button
          labelStyle={{color: 'white', fontSize: 20}}
          style={{...styles.loginButton, ...styles.mt10}}
          onPress={callback}
        >
         <Icon name="telegram" size={30} style={{marginRight: 20}} /> Перейти в telegram
        </Button>
      <Button labelStyle={{color: '#D9550D'}} style={styles.mt10} onPress={toLoginHandler}>Есть код? Залогинься здесь!</Button>
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