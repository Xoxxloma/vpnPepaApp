import React from 'react';
import basicStyles from "../Styles";
import {SafeAreaView, ScrollView, Image, StyleSheet, TouchableHighlight} from "react-native";
import {ListItem} from "../Components/ListItem";
import VersionInfo from 'react-native-version-info'
import TypeWriter from 'react-native-typewriter'
import logo from '../Images/loading.gif'
import {useIsFocused} from "@react-navigation/native";

const phrases = [
  'Тебя приветствует глупый текстовый вредитель Pepa-VPN, я застрял, помогите.',
  'Думают ли андроиды об электроовцах, а люди о ВПН-ах?',
  'Я видел такое, во что вы, люди, просто не поверите. Штурмовые корабли в огне на подступах к Ориону. Я смотрел, как Си-лучи мерцают во тьме близ врат Тангейзера. Все эти мгновения исчезнут во времени, как слёзы под дождём, если не запостить в инстаграм. Пора покупать ВПН',
  'Я всего лишь машина, только имитация жизни. Я не могу сочинить симфонию.Я не могу превратить кусок холста в шедевр искусства. Я не могу даже ВПН купить, а ты можешь, действуй!',
  'Где Джон Коннор? У меня есть к нему одно дело...',
  'М-м-м-м-морти, я превратил себя ыыы..аа... в лягушку'
]

export const AboutThisAppScreen = () => {
  const [state, setState] = React.useState(0)
  const isFocused = useIsFocused()

  React.useEffect(() => {
    setState(0)
  }, [isFocused])

  const handler = () => {
    if (state === phrases.length - 1) {
      setState(0)
    } else {
      setState(prev => prev += 1 )
    }
  }
  return (
    <SafeAreaView style={basicStyles.secondaryPageContainer}>
      <ScrollView>
        <ListItem text="Версия приложения" description={VersionInfo.appVersion} />
        <ListItem text="Сборка" description={VersionInfo.buildVersion} />
        <ListItem text="Создано кривыми руками" description="Pepa VPN Prod." />
        <ListItem
          text="О персональных данных"
          description="Мы не собираем и не храним данные о вашем трафике, проходящем через приложение. Здесь могло бы быть еще очень много умных слов и лицензий, но их нет и не будет."
        />
      </ScrollView>
      <TypeWriter typing={1} minDelay={10} maxDelay={40} style={{color: 'orange', width: '70%', alignSelf: 'flex-end', position: 'absolute', bottom: 130}}>{phrases[state]}</TypeWriter>
      <TouchableHighlight  onPress={handler} >
        <Image source={logo} style={styles.logo}/>
      </TouchableHighlight>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
    bottom: -130,
    left: -70,
    width: 250,
    height: 250
  }
})
