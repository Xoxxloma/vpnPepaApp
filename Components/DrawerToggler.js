import React from 'react';
import {StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from '@react-navigation/native';

export const DrawerToggler = () => {
  const navigation = useNavigation();
  const toggleDrawerHandler = () => navigation.toggleDrawer()
  return (
    <View style={styles.btn}>
      <Icon
        name="menu"
        size={40}
        color="white"
        onPress={toggleDrawerHandler} />
    </View>
  )
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    left: 5,
    top: 5,
  },
});
