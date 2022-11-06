import {StyleSheet, Text, Platform, Image, View, Linking} from 'react-native';
import React from 'react'
import {Button, Menu, IconButton} from "react-native-paper";
import Toast from 'react-native-toast-message';
import RNSimpleOpenvpn, { addVpnStateListener, removeVpnStateListener } from 'react-native-simple-openvpn';
import * as Animatable from 'react-native-animatable';
import fire from '../Images/fire.png'
import city from '../Images/city.png'
import netherlands from '../Images/netherlands.png'
import argentina from '../Images/argentina.png'
import publicIP from 'react-native-public-ip'
import {PepaLogo} from "../Components/PepaLogo";
import Icon from "react-native-vector-icons/FontAwesome";
import {useAuth} from "../Contexts/AuthContext";
import {Spinner} from "../Components/Spinner";
import basicStyles from '../Styles'
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import NativeSafeAreaView from "react-native-safe-area-context/src/specs/NativeSafeAreaView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {statusPoller, subscriptionExpired} from "../Utils/helpers";
import sad from '../Images/sad.gif'
import happy from '../Images/happy.png'
import glassesDown from '../Images/glassesDown.png'
import waiting from '../Images/waiting.png'
import VersionInfo from "react-native-version-info";
import {API} from "../services/axiosInstance";

const isIPhone = Platform.OS === 'ios';

const instancePictures = (key) => {
  switch (key) {
    case "Нидерланды":
      return netherlands
    case 'Аргентина':
      return argentina
    default:
      return city
  }
}


export default function MainScreen() {
  const { authData, setUser, config } = useAuth()
  const navigation = useNavigation()
  const [vpnStatus, setVpnStatus] = React.useState(null)
  const [isIPLoading, setIPLoading] = React.useState(false)
  const [showInstancesMenu, setShowInstancesMenu] = React.useState(false)
  const [showOldVersionNotification, setShowOldVersionNotification] = React.useState(config?.lastStableVersion !== VersionInfo.appVersion)
  const [pickedInstance, setPickedInstance] = React.useState(config.servers[0])
  const isVpnConnected = vpnStatus === 2
  const isVpnDisconnected = !vpnStatus || vpnStatus === 0
  const restVpnStatuses = vpnStatus === 1 || vpnStatus === 3 || vpnStatus === 4

  const pollBillIfItNeeded = async () => {
    // Если было закрыто приложение во время покупки - берем айдишник и смотрим результат операции или продолжаем поллинг
    const pollingBillId = await AsyncStorage.getItem('pollingBillId')
    const shouldPoll = JSON.parse(await AsyncStorage.getItem('shouldPollBill'))
    if (pollingBillId && shouldPoll) {
      statusPoller(
        authData.telegramId,
        pollingBillId,
        setUser,
      )
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      pollBillIfItNeeded()
    }, [])
  )

  React.useEffect(() => {
    async function checkIp() {
      try {
        const ip = await publicIP()
        const ovpnInstance = config.servers.find(i => i.ip === ip)
        if (ovpnInstance) {
          setVpnStatus(2)
          setPickedInstance(ovpnInstance)
        }
      } finally {
        setIPLoading(false)
      }
    }

    checkIp()
      .then(() => {
        if (showOldVersionNotification) {
          Toast.show({type: 'info', text1: 'Появилась новая версия приложения!', text2: 'Кликни чтобы обновиться', onPress: onUpdateVersionHandler, visibilityTime: 15000 })
        }
      })
      .then(() => getLastNews())


  }, [])

  React.useEffect(() => {
    async function observeVpn() {
      if (isIPhone) {
        await RNSimpleOpenvpn.observeState();
      }

      addVpnStateListener((e) => {
        setVpnStatus(e.state)
      });
    }

    observeVpn();

    return async () => {
      if (isIPhone) {
        await RNSimpleOpenvpn.stopObserveState();
      }
      removeVpnStateListener();
    };
  }, []);

  React.useEffect(() => {
    if (isVpnConnected) {
      Toast.show({type: 'success', text1: 'Подключено успешно!' })
    }
  }, [vpnStatus])


  const onUpdateVersionHandler = async () => {
    setShowOldVersionNotification(false)
    await Linking.openURL('https://play.google.com/store/apps/details?id=com.pepavpn')
  }

  const getLastNews = async () => {
    const news = await API.getNews()
    if (news) {
      const [text1, text2] = news.split('$SEPARATOR')
      Toast.show({type: 'info', text1, text2, visibilityTime: 15000 })
    }
  }

  async function startOvpn() {
    try {
      await RNSimpleOpenvpn.connect({
        // remoteAddress: pickedInstance.ip,
        ovpnString: authData.certificate
      });
    } catch (error) {
      Toast.show({type: 'error', text1: 'Ошибка подключения, попробуйте позже!'})
    }
  }

  async function stopOvpn() {
    try {
      await RNSimpleOpenvpn.disconnect();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Ошибка соединения, попробуйте позже!' })
    }
  }

  const toggleVpn = async () => {
    if (isVpnDisconnected) {
      return await startOvpn()
    }
    if (isVpnConnected) {
      return await stopOvpn()
    }
    return await stopOvpn()
  }

  const navigateToShop = () => navigation.navigate('Shop')

  const selectVpnInstance = (instance) => () => {
    setPickedInstance(instance)
    setShowInstancesMenu(false)
  }

  const renderLogo = () => {
    if (authData.isSubscriptionActive) {
      return isVpnConnected ? glassesDown : isVpnDisconnected ? waiting : happy
    } else {
      return sad;
    }
  }

  const renderInstanceMenu = () => {
    return (
      <View style={{position: 'absolute', top: 0, right: 0}}>
        <Menu
          style={{marginTop: 10}}
          visible={showInstancesMenu}
          onDismiss={() => setShowInstancesMenu(false)}
          anchor={<Button
            labelStyle={{color: '#D9550D'}}
            onPress={() => setShowInstancesMenu(true)}>
            Выбрать сервер
          </Button>}
        >
          {config.servers.map(i => (
            <Menu.Item
              titleStyle={{
                color: i.name === pickedInstance.name ? '#D9550D' : 'gray'
              }}
              style={{ backgroundColor: i.name === pickedInstance.name ? 'orange' : 'white'}}
              key={i.name}
              onPress={selectVpnInstance(i)}
              title={i.name}
            />
          ))}
        </Menu>
      </View>
    )
  }

  const renderProfileName = () => {
    return (
      <View style={styles.profileNameContainer}>
        {Boolean(authData.isSubscriptionActive)
          ? <Text style={styles.profileNameLabel}>Подписка №{authData.telegramId}</Text>
          : <Text style={styles.profileNameLabel}>У вас нет активной подписки</Text>
        }
      </View>
    )
  }

  const renderButton = () => {
    const btnText = isVpnConnected ? 'Отключить' : isVpnDisconnected ? 'Подключить' : 'В процессе'

    return (
      <View style={styles.buttonContainer}>
        {authData.isSubscriptionActive
          ? <Animatable.View
            animation={isVpnDisconnected ? 'shake' : ''}
            iterationCount="infinite"
            duration={2500}
            iterationDelay={3000}
          >
            <Button
              labelStyle={{color: 'white', fontSize: 20}}
              style={styles.connectButton(isVpnConnected)}
              disabled={restVpnStatuses}
              onPress={toggleVpn}
            >
              {btnText}
            </Button>
          </Animatable.View>
          : <Button
            style={styles.noProfileText}
            labelStyle={{color: 'white', fontSize: 15}}
            onPress={navigateToShop}
          >
            Купить подписку
          </Button>
        }
      </View>
    )
  }

  const renderBody = () => {
    if (isIPLoading) {
      return <Spinner />
    }
    return (
      <>
        {/*{renderInstanceMenu()}*/}
        {isVpnConnected && <Image source={fire} style={styles.fire} /> }
        <Image source={instancePictures(pickedInstance.name)} style={styles.picture} />
        <View style={styles.main}>
          <Text style={basicStyles.label}>
            Pepa VPN
          </Text>
          <PepaLogo
            logo={renderLogo()}
            containerStyles={{...basicStyles.logoContainer, ...styles.grayBorder }}
            logoStyles={basicStyles.logo}
          />
          {renderProfileName()}
        </View>
        {renderButton()}
      </>
    )
  }

  return (
    <NativeSafeAreaView style={styles.container}>
      {renderBody()}
    </NativeSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fire: {
    width: '100%',
    height: '150%',
    position: 'absolute',
    top: -80,
    justifyContent: 'center',
    zIndex: -100
  },
  picture: {
    borderTopRightRadius: 220,
    borderTopLeftRadius: 220,
    width: "100%",
    height: '30%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0
  },
  grayBorder: {
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  buttonContainer: {
    marginBottom: 40,
    padding: 10
  },
  profileNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  profileNameLabel: {
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: 20,
    color: 'white',
  },
  connectButton: (isVpnConnected) => {
    const bgColor = isVpnConnected ? '#D9550D' : '#1DC76B'
    return {
      backgroundColor: bgColor,
      padding: 10,
    }
  },
  noProfileText: {
    backgroundColor: '#D9550D',
    padding: 15
  },
});

