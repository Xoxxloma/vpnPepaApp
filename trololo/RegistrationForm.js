import SafeAreaView from "react-native/Libraries/Components/SafeAreaView/SafeAreaView";
import {TextInput, Button} from "react-native-paper";
import React from 'react';
import {StyleSheet, Text} from "react-native";
import {PepaLogo} from "./PepaLogo";


export const RegistrationForm = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>
        Login
      </Text>

        <TextInput
          label="Login"
          value={''}
          mode="flat"
          onChangeText={null}
          activeUnderlineColor="#D9550D"
          style={styles.mt10}
        />
        <TextInput
          label="Password"
          value={''}
          onChangeText={null}
          activeUnderlineColor="#D9550D"
          style={styles.mt10}
        />
        <Button
          labelStyle={{color: 'white', fontSize: 20}}
          style={{...styles.loginButton, ...styles.mt10}}
        >
          Pepega
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
    backgroundColor: '#D9550D',
    color: 'white',
    padding: 10,
  },
  label: {
    fontFamily: 'TitilliumWeb-Regular',
    color: '#D9550D',
    fontSize: 48,
    marginBottom: 10,
    textAlign: 'center'
  },
  logoContainer: {
    borderRadius: 200 / 2,
    width: 200,
    height: 200,
    borderWidth: 30,
  },
  orangeBorder: {
    borderColor: 'rgba(217, 85, 13, 1)',
  },
  logo: {
    borderRadius: 200 / 2,
    width: '100%',
    height: '100%'
  },
})