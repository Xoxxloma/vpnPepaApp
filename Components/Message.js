import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import dayjs from "dayjs";
import {Avatar} from "react-native-paper";
import coolguy from '../Images/glassesDown.png'

export const Message = ({message}) => {
  const isSupportMessage = message.sender === 'Поддержка'
  const fromStyle = isSupportMessage ? styles.support : styles.owner
  return (
    <View style={{...styles.chat, ...fromStyle }}>
      <View style={{flexDirection: 'row'}}>
        { isSupportMessage && <Avatar.Image size={15} source={coolguy} style={{marginRight: 5, marginTop: 3}} /> }
        <Text style={styles.title}>{message.sender}</Text>
      </View>
        <Text style={styles.timestamp}>{dayjs(message.timestamp).format("DD.MM HH:mm")}</Text>
      <Text style={{color: 'black'}}>{message.text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  },
  chat: {
    width: '70%',
    borderRadius: 15,
    padding: 8,
    margin: 10
  },
  timestamp: {
    color: 'gray',
    fontSize: 12
  },
  owner: {
    alignSelf: "flex-start",
    backgroundColor: 'white',
  },
  support: {
    alignSelf: "flex-end",
    backgroundColor: '#f7ddce',
  }
})
