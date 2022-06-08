import React from 'react';
import {Portal, Dialog, Button, Paragraph, Title} from "react-native-paper";
import {StyleSheet} from "react-native";
import Rate, {AndroidMarket} from "react-native-rate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";

export const RateUsDialogue = ({hideDialogue, isDialogueVisible}) => {
    const navigateToMarket = () => {
        Rate.rate({
            GooglePackageName: 'com.pepavpn',
            preferInApp: false,
            preferredAndroidMarket: AndroidMarket.Google,
        }, (async (success, error) => {
            if (success) {
                await AsyncStorage.setItem('feedback', dayjs().format("DD-MM-YYYY"))
                toggleDialogue()
            }
            if (error) {
                Toast.show({ type: 'error', text1: 'Произошла ошибка, повторите попытку.'})
            }
        }))
    }

    return (
        <Portal>
            <Dialog visible={isDialogueVisible} onDismiss={hideDialogue} style={styles.container}>
                <Dialog.Content>
                    <Title>Да, это именно то окно,</Title>
                    <Paragraph style={styles.paragraph}>которое в̶с̶е̶ ̶ч̶и̶т̶а̶ю̶т̶ закрывают закатывая глаза. А разработчики ждут оценок, чтобы продвинуть приложение выше и купить себе д̶о̶ш̶и̶р̶а̶к̶ очередной красный феррари.
                    </Paragraph>
                    <Paragraph style={styles.paragraph}>
                        Но наши пользователи личности! Мы не вправе просить, состоявшихся в этой жизни людей, лоббировать чужие интересы, ведь мы с Вами собрались здесь чтобы лайкать котов в одной, признанной экстремистской, социальной сети.
                    </Paragraph>
                </Dialog.Content>
                <Dialog.Actions style={{justifyContent: 'space-around'}}>
                    <Button mode="contained" style={styles.dontwant} onPress={hideDialogue}>Не хочу</Button>
                    <Button mode="contained" style={styles.iamperson} onPress={navigateToMarket}>Я личность</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fcf4f0',
        borderRadius: 20
    },
    paragraph: {
        fontSize: 15
    },
    iamperson: {
        backgroundColor: '#D9550D',
        padding: 5
    },
    dontwant: {
        backgroundColor: 'gray',
        padding: 5
    }
})
