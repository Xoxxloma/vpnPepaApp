import {StyleSheet, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker'
import React from "react"
import fs from 'react-native-fs'
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {useAuth} from "./Contexts/AuthContext";

export const PepaBar = () => {
    const {signOut} = useAuth()

    const pickProfileHandler = async () => {
        try {
            await signOut()
        } catch (e) {
            Toast.show({type: 'error', text1: 'Ошибка загрузки профиля, попробуйте снова.'})
        }
    }

    return (
      <View style={styles.btn}>
          <Icon
            name="logout"
            size={40}
            color="white"
            onPress={pickProfileHandler} />
      </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        position: 'absolute',
        right: 5,
        top: 5,
    },
});
