import {StyleSheet, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker'
import React from "react"
import fs, {TemporaryDirectoryPath} from 'react-native-fs'
import Icon from "react-native-vector-icons/Feather";

export const PepaBar = ({addProfile}) => {
    const pickProfileHandler = async () => {
        const result = await DocumentPicker.pickSingle({type: "application/octet-stream"})
        const content = await fs.readFile(result.uri)
        addProfile({name: result.name, ovpn: content})
        const isProfilesFolderExists = await fs.exists(`${TemporaryDirectoryPath}/vpnProfiles`)
        if (!isProfilesFolderExists) {
           await fs.mkdir(`${TemporaryDirectoryPath}/vpnProfiles`)
        }
        await fs.writeFile(`${TemporaryDirectoryPath}/vpnProfiles/${result.name}`, content, "utf8")
    }

    return (
      <View style={styles.btn}>
          <Icon
            name="plus-square"
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