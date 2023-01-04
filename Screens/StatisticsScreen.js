import React from 'react';
import basicStyles from "../Styles";
import {Image, SafeAreaView, StyleSheet, Text} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {API} from "../services/axiosInstance";
import {useAuth} from "../Contexts/AuthContext";
import wasted from "../Images/wasted.jpg";
import {View} from "react-native-animatable";
import {ProgressBar} from "react-native-paper";
import smth from "../Images/glassesDown.png";
import {Spinner} from "../Components/Spinner";
import {inRange} from "../Utils/helpers";
import Toast from "react-native-toast-message";


const firstBarierValue = 3.33
const secondBarierValue = 6.66
const lastBarierValue = 10

const data = [
  {text: 'Инстаграм-плебей', image: smth, from: 0, to: firstBarierValue},
  {text: 'Уверенный инфлюенсер', image: smth, from: firstBarierValue, to: secondBarierValue},
  {text: 'Самый быстрый репостер', image: smth, from: secondBarierValue, to: lastBarierValue},
  {text: 'VPN-богема', image: smth, from: lastBarierValue, to: Number.MAX_SAFE_INTEGER},
]

export const StatisticsScreen = () => {
  const { authData } = useAuth()
  const [userStatistics, setUserStatistics] = React.useState({ userReceivedGb: 0, avgRate: 0, percentRate: 0 })
  const [isLoading, setLoading] = React.useState(false)
  const {percentRate, avgRate, userReceivedGb} = userStatistics

  const options = data.find(d => inRange(userReceivedGb, d.from, d.to))

  const isBarierExists = (barierValue) => (barierValue - userReceivedGb) > 0
  const valueRemaining = (barierValue) => (barierValue - userReceivedGb).toFixed(2)

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true)

      API.getUserStatistics(authData.telegramId)
        .then(res => {
          const userReceivedGb = (res.userReceivedBytes / (1024 * 1024 * 1024)).toFixed(2)
          const percentRate = ((res.userReceivedBytes / res.data.sum) * 100).toFixed(2)
          const avgRate = (userReceivedGb / lastBarierValue).toFixed(5)
          setUserStatistics({
            userReceivedGb,
            avgRate,
            percentRate
          })
        })
        .catch(e => Toast.show({type: 'error', text1: 'Ошибка загрузки данных, попробуйте позже!', visibilityTime: 5000}) )
        .finally(() => setLoading(false))
    }, [])
  )

  if (isLoading) return <Spinner text="Загрузка..." />

  return (
    <SafeAreaView style={basicStyles.secondaryPageContainer}>
      <Image source={wasted} style={styles.wasted} />
      <Text style={styles.text}>{userReceivedGb} гб за последние 30 дней</Text>
      <Text style={styles.text}>Вы расходуете {percentRate}% траффика от среднего значения наших пользователей</Text>
      <Text style={styles.text}>Заполняй шкалу ниже и получай достижения</Text>
      <View style={styles.container}>
        <Text style={{position: 'absolute', top: 30, left: 10, color: 'white'}}>0 гб</Text>
        <Text style={{position: 'absolute', top: 30, right: 10, color: 'white'}}>{lastBarierValue} гб</Text>
        {isBarierExists(firstBarierValue) &&
        <>
          <Text style={{position: 'absolute', top: 12, left: "34%", color: 'white'}}>|</Text>
          <Text style={{position: 'absolute', top: 30, left: "27%", color: 'white'}}>
            еще {valueRemaining(firstBarierValue)} гб
          </Text>
        </>
        }
        {isBarierExists(secondBarierValue) &&
        <>
          <Text style={{position: 'absolute', top: 30, left: "60%", color: 'white'}}>
            еще {valueRemaining(secondBarierValue)} гб
          </Text>
          <Text style={{position: 'absolute', top: 12, left: "67%", color: 'white'}}>|</Text>
        </>
        }
        <ProgressBar progress={Number.parseFloat(avgRate)} color="orange" style={styles.progressBar} />
      </View>
      <View style={{alignItems: 'center', marginTop: 15}}>
        <Text style={styles.header}>Твой текущий титул:</Text>
        <Image source={options.image} style={styles.logo} />
        <Text style={styles.header}>{options.text}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 10,
    color: 'white',
    position: 'relative'
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    height: 30
  },
  wasted: {
    height: 40,
    width: '100%',
    marginTop: 10
  },
  logo: {
    height: 200,
    width: 200,
    borderRadius: 200 / 2,
    marginTop: 20
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginTop: 15,
    alignSelf: 'center'
  },
  header: {
    color: 'white',
    fontSize: 20,
    marginTop: 15
  }
})
