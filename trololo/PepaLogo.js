import React from 'react';
import * as Animatable from "react-native-animatable";
import {Image, StyleSheet, Text} from "react-native";
import pepa from "../pepa.jpg";


export const PepaLogo = ({containerStyles, logoStyles, text}) => {
  return (
    <>
      <PepaLogo />
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        style={containerStyles}
      >
        <Image source={pepa} resizeMode="cover" style={logoStyles} />
      </Animatable.View>
      {Boolean(text) && <Text style={styles.text}>{text}</Text>}
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: 20,
    color: '#D9550D',
    marginTop: 15
  },
});