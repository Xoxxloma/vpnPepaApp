import React from 'react'
import {View, Text, StyleSheet} from 'react-native';

export const ListItem = ({text, description}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  text: {
    fontSize: 22,
    color: "white"
  },
  description: {
    fontSize: 15,
    color: "white"
  }
});
