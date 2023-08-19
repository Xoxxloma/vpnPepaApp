import * as React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import VersionInfo from "react-native-version-info";
import {useAuth} from "../Contexts/AuthContext";
import {ScrollView} from "react-native-gesture-handler";
import smart2 from '../Images/smart2.png'
import {StyleSheet} from "react-native";
import {Image} from "react-native-animatable";

export const NewFeaturesDialogue = ({ hideDialog, visible}) => {
  const { config } = useAuth()
  const bodyText = config.newFeatures || 'Упс, произошла какая то чудовищная ошибка.\nПопробуйте нажать кнопку рефреш на главном экране и заглянуть сюда еще разочек.'
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{height: '75%'}}>
        <Image source={smart2} style={styles.logo} />
        <Dialog.Title>
          Что нового? Версия {VersionInfo.appVersion}
        </Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={{paddingHorizontal: 24, paddingVertical: 10}}>
            <Text variant="bodyMedium">{bodyText}</Text>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button labelStyle={{color: '#D9550D'}} onPress={hideDialog}>Закрыть</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
    top: 3,
    right: 3,
    borderRadius: 40 / 2,
    width: 40,
    height: 40,
    borderWidth: 3,
  },
})
