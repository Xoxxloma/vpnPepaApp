import {StyleSheet, View} from "react-native";
import {PepaLogo} from "./PepaLogo";
import React from "react";
import basicStyles from '../Styles'
import loading from '../Images/loading.gif'

export const Spinner = ({ text }) => {
  return (
    <View style={styles.main}>
      <PepaLogo logo={loading} logoStyles={basicStyles.logo} containerStyles={{...basicStyles.logoContainer, ...basicStyles.orangeBorder}} text={text} />
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
})
