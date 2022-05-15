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
    padding: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 25,
    color: "white"
  },
  description: {
    fontSize: 15,
    color: "white"
  }
});
