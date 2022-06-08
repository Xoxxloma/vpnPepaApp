import React from 'react';
import basicStyles from "../Styles";
import {SafeAreaView, ScrollView} from "react-native";
import {ListItem} from "../Components/ListItem";
import VersionInfo from 'react-native-version-info'

export const AboutThisAppScreen = () => (
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
  </SafeAreaView>
)
