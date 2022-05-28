import React from 'react';
import { StyleSheet } from 'react-native'
import {Card, Paragraph, Title, Button} from "react-native-paper";
import pepa from '../pepa.jpg'

export const CommodityCard = ({subscribe, handler}) => {

  return (
      <Card style={{backgroundColor: "white", marginVertical: 15}}>
        <Card.Content style={{padding: 10}}>
          <Title style={{...styles.mainColor, fontSize: 22}}>{subscribe.text} по цене {subscribe.price} ₽</Title>
          <Paragraph style={{...styles.mainColor, fontSize: 15 }}>{subscribe.description}</Paragraph>
        </Card.Content>
        <Card.Cover source={pepa} style={{width: 200, height: 200, alignSelf: 'center', borderRadius: 200 / 2}} />
        <Card.Actions style={{flexDirection: 'row-reverse'}}>
          <Button mode='contained' labelStyle={{color: 'white'}} style={styles.btn} onPress={handler}>Купить</Button>
        </Card.Actions>
      </Card>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'column',
    padding: 20
  },
  mainColor: {
    color: '#D9550D'
  },
  btn: {
    backgroundColor: '#D9550D',
    padding: 10
  }
})
