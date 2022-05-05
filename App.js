import {StyleSheet, Text, SafeAreaView, Platform, Image, View} from 'react-native';
import {PepaBar} from "./PepaBar";
import React from 'react'
import {Button} from "react-native-paper";
import Toast from 'react-native-toast-message';
import RNSimpleOpenvpn, { addVpnStateListener, removeVpnStateListener } from 'react-native-simple-openvpn';
import * as Animatable from 'react-native-animatable';
import fs, {TemporaryDirectoryPath} from 'react-native-fs'
import fire from './fire.png'
import city from './city.png'
import Icon from "react-native-vector-icons/Feather";
import publicIP from 'react-native-public-ip'
import {PepaLogo} from "./trololo/PepaLogo";

const isIPhone = Platform.OS === 'ios';
const remoteIP = '185.105.108.208'

const initialState = { name: '', ovpn: '' }

export default function App() {
  const [profile, addProfile] = React.useState(initialState)
  const [vpnStatus, setVpnStatus] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const isVpnConnected = vpnStatus === 2
  const isVpnDisconnected = !vpnStatus || vpnStatus === 0
  const restVpnStatuses = vpnStatus === 1 || vpnStatus === 3 || vpnStatus === 4

  React.useEffect(() => {
    async function prefillFields() {
      setIsLoading(true)
      try {
        const pathToDir = `${TemporaryDirectoryPath}/vpnProfiles`
        const isExists = await fs.exists(pathToDir)
        if (isExists) {
          const res = await fs.readDir(pathToDir)
          if (res.length) {
            const content = await fs.readFile(res[0].path)
            addProfile({name: res[0].name, ovpn: content})
          }
        }
        const ip = await publicIP()
        if (ip === remoteIP) {
          setVpnStatus(2)
        }
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        Toast.show({type: 'error', text1: 'Ошибка, попробуйте снова или перезагрузите приложение!'})
        console.log(e, "error in prefill")
      }
    }
    prefillFields()

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

  async function startOvpn() {
    try {
      await RNSimpleOpenvpn.connect({
        ovpnString: profile.ovpn
      });
      Toast.show({type: 'success', text1: 'Подключено успешно!'})
    } catch (error) {
      console.log(error, 'error start vpn')
      Toast.show({type: 'error', text1: 'Ошибка подключения, попробуйте позже!'})
    }
  }

  async function stopOvpn() {
    try {
      await RNSimpleOpenvpn.disconnect();
    } catch (error) {
      console.log(error, 'error stopVpn')
      Toast.show({type: 'error', text1: 'Ошибка соединения, попробуйте позже!'})
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

  const deleteProfile = async() => {
    const pathToFile = `${TemporaryDirectoryPath}/vpnProfiles/${profile.name}`
    const exists = fs.exists(pathToFile)
    try {
      if (exists) {
        await fs.unlink(pathToFile)
        addProfile(initialState)
      }
    } catch (e) {
      Toast.show({type: 'error', text1: 'Ошибка удаления профиля, попробуйте снова.'})
    }
  }

  const renderButton = () => {
    const btnText = isVpnConnected ? 'Disconnect' : isVpnDisconnected ? 'Connect' : 'Processing'

    return profile.ovpn
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
      : <Text style={styles.noProfileText}>Нет доступных профилей</Text>
  }

  const renderSpinner = () => {
    return (
      <View style={styles.main}>
        <PepaLogo logoStyles={styles.logo} containerStyles={{...styles.logoContainer, ...styles.orangeBorder}} text="Загрузка..." />
      </View>
    )
  }

  const renderBody = () => {
    if (isLoading) {
      return renderSpinner()
    }
    return (
      <>
        {isVpnConnected && <Image source={fire} style={styles.fire} /> }
        <Image source={city} style={styles.city} />
        <PepaBar addProfile={addProfile} />
        <View style={styles.main}>
          <Text style={styles.label}>
            Pepa VPN
          </Text>
          <PepaLogo containerStyles={{...styles.logoContainer, ...styles.grayBorder }} logoStyles={styles.logo} />
          { Boolean(profile.ovpn) && <View style={styles.profileNameContainer}>
            <Text style={styles.profileNameLabel}>{profile.name}</Text>
            <Icon style={{marginLeft: 10}} name="trash-2" size={20} color="white" onPress={deleteProfile}/>
          </View>
          }
        </View>
        <View style={styles.buttonContainer}>
          {renderButton()}
        </View>
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderBody()}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
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
  logoContainer: {
    borderRadius: 200 / 2,
    width: 200,
    height: 200,
    borderWidth: 30,
  },
  grayBorder: {
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  orangeBorder: {
    borderColor: 'rgba(217, 85, 13, 1)',
  },
  logo: {
    borderRadius: 200 / 2,
    width: '100%',
    height: '100%'
  },
  label: {
    fontFamily: 'TitilliumWeb-Regular',
    color: 'white',
    fontSize: 48,
    marginBottom: 10
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
    color: 'white',
    fontSize: 20,
    backgroundColor: '#D9550D',
    padding: 20
  },
});

