import {StyleSheet, Text, Platform, Image, View} from 'react-native';
import React from 'react'
import {Button} from "react-native-paper";
import Toast from 'react-native-toast-message';
import RNSimpleOpenvpn, { addVpnStateListener, removeVpnStateListener } from 'react-native-simple-openvpn';
import * as Animatable from 'react-native-animatable';
import fire from '../fire.png'
import city from '../city.png'
import publicIP from 'react-native-public-ip'
import {PepaLogo} from "../Components/PepaLogo";
import {useAuth} from "../Contexts/AuthContext";
import {Spinner} from "../Components/Spinner";
import basicStyles from '../Styles'
import {useIsFocused, useNavigation} from "@react-navigation/native";
import NativeSafeAreaView from "react-native-safe-area-context/src/specs/NativeSafeAreaView";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {statusPoller, successCallback} from "../Utils/helpers";

const isIPhone = Platform.OS === 'ios';
const remoteIP = '185.105.108.208'

export default function MainScreen() {
  const {authData, setUser} = useAuth()
  const navigation = useNavigation()
  const [vpnStatus, setVpnStatus] = React.useState(null)
  const [isIPLoading, setIPLoading ] = React.useState(true)
  const isFocused = useIsFocused()

  const isVpnConnected = vpnStatus === 2
  const isVpnDisconnected = !vpnStatus || vpnStatus === 0
  const restVpnStatuses = vpnStatus === 1 || vpnStatus === 3 || vpnStatus === 4

  const pollBillIfItNeeded = async () => {
    const pollingBillId = await AsyncStorage.getItem('pollingBillId')
    if (pollingBillId) {
      statusPoller(
        authData.telegramId,
        pollingBillId,
        successCallback((data) => setUser(data.client))
      )
    }
  }

  React.useEffect(() => {
    pollBillIfItNeeded()
  }, [isFocused])

  React.useEffect(() => {
    async function checkIp() {
      try {
        const ip = await publicIP()
        if (ip === remoteIP) {
          setVpnStatus(2)
        }
        setIPLoading(false)
      } finally {
        setIPLoading(false)
      }
    }
    checkIp()

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

  async function startOvpn() {
    try {
      await RNSimpleOpenvpn.connect({
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
      await startOvpn()
    }
    if (isVpnConnected) {
      await stopOvpn()
    }
  }

  const navigateToShop = () => navigation.navigate('Shop')

  const renderButton = () => {
    const btnText = isVpnConnected ? 'Отключить' : isVpnDisconnected ? 'Подключить' : 'В процессе'

    return authData.isSubscriptionActive
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
          { btnText }
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

  const renderBody = () => {
    if (isIPLoading) {
      return <Spinner />
    }
    return (
      <>
        {isVpnConnected && <Image source={fire} style={styles.fire} /> }
        <Image source={city} style={styles.city} />
        <View style={styles.main}>
          <Text style={basicStyles.label}>
            Pepa VPN
          </Text>
          <PepaLogo containerStyles={{...basicStyles.logoContainer, ...styles.grayBorder }} logoStyles={basicStyles.logo} />
            <View style={styles.profileNameContainer}>
              {Boolean(authData.isSubscriptionActive)
                ? <Text style={styles.profileNameLabel}>Подписка №{authData.telegramId}</Text>
                : <Text style={styles.profileNameLabel}>У вас нет активной подписки</Text>
              }
            </View>
        </View>
        <View style={styles.buttonContainer}>
          {renderButton()}
        </View>
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
    top: -100,
    justifyContent: 'center',
  },
  city: {
    borderTopRightRadius: 200,
    borderTopLeftRadius: 200,
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

