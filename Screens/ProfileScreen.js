import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {useAuth} from "../Contexts/AuthContext";
import {ListItem} from "../Components/ListItem";
import { List } from 'react-native-paper'
import {termUnits, paymentsStatuses} from "../Utils/consts";
import {formatDate} from "../Utils/helpers";
import styles from '../Styles'

export const ProfileScreen = () => {
  const {authData} = useAuth()

  const createPaymentDescription = (p) => {
    return `Срок: ${p.term ?? ''} ${termUnits[p.termUnit] ?? ''}, статус: ${paymentsStatuses[p.status.value] ?? ''}, дата: ${formatDate(p.status.changedDateTime)}`
  }

  return (
    <SafeAreaView style={styles.secondaryPageContainer}>
      <ListItem text={authData.name} description="Имя" />
      <ListItem text={authData.isSubscriptionActive ? formatDate(authData.expiresIn) : "Нет активной подписки"} description="Срок действия подписки" />
      <ScrollView>
      <List.Accordion title="История платежей" titleStyle={{color: 'white'}} theme={{colors: {text: 'white', background: 'black'}}}>
        { authData.paymentsHistory.map(p => (
          <List.Item
            key={p.id}
            title={createPaymentDescription(p)}
            titleNumberOfLines={2}
            titleStyle={{color: 'white'}}
            theme={{colors: {text: 'white'}}}
          />
        ))}
      </List.Accordion>
      </ScrollView>
    </SafeAreaView>
  )
}

