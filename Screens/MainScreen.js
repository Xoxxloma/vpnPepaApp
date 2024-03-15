import {
  StyleSheet,
  Text,
  Platform,
  Image,
  View,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import {Button, Menu, IconButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import RNSimpleOpenvpn, {
  addVpnStateListener,
  removeVpnStateListener,
} from 'react-native-simple-openvpn';
import * as Animatable from 'react-native-animatable';
import fire from '../Images/fire.png';
import city from '../Images/city.png';
import {PepaLogo} from '../Components/PepaLogo';
import {useAuth} from '../Contexts/AuthContext';
import {Spinner} from '../Components/Spinner';
import basicStyles from '../Styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import NativeSafeAreaView from 'react-native-safe-area-context/src/specs/NativeSafeAreaView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkBillStatus, subscriptionExpired} from '../Utils/helpers';
import sad from '../Images/sad.gif';
import happy from '../Images/happy.png';
import glassesDown from '../Images/glassesDown.png';
import waiting from '../Images/waiting.png';
import hobo from '../Images/hobo.png';
import VersionInfo from 'react-native-version-info';
import {API} from '../services/axiosInstance';
import {NewFeaturesDialogue} from '../Components/NewFeaturesDialogue';

const isIPhone = Platform.OS === 'ios';

export default function MainScreen() {
  const {authData, setUser, config} = useAuth();
  const navigation = useNavigation();
  const [vpnStatus, setVpnStatus] = React.useState(null);
  const [isIPLoading, setIPLoading] = React.useState(true);
  const [showInstancesMenu, setShowInstancesMenu] = React.useState(false);
  const [showWhatsNewDialog, setShowWhatsNewDialog] = React.useState(false);
  const [showOldVersionNotification, setShowOldVersionNotification] =
    React.useState(config?.lastStableVersion !== VersionInfo.appVersion);
  const servers = config.servers.filter(s => authData.ips?.includes(s.ip));
  const [pickedInstance, setPickedInstance] = React.useState(servers[0]);
  const isVpnConnected = vpnStatus === 2;
  const isVpnDisconnected = !vpnStatus || vpnStatus === 0;
  const restVpnStatuses = vpnStatus === 1 || vpnStatus === 3 || vpnStatus === 4;

  // const pollBillIfItNeeded = async () => {
  //   // Если было закрыто приложение во время покупки - берем айдишник и смотрим результат операции
  //   const pollingBillId = await AsyncStorage.getItem('pollingBillId');
  //   if (pollingBillId) {
  //     checkBillStatus(authData.telegramId, pollingBillId, setUser);
  //   }
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     pollBillIfItNeeded();
  //   }, []),
  // );

  React.useEffect(() => {
    async function checkIp() {
      try {
        const ip = await API.getCurrentIp();
        const ovpnInstance = servers.find(i => i.ip === ip);
        if (ovpnInstance) {
          setVpnStatus(2);
          setPickedInstance(ovpnInstance);
        }
      } catch (e) {
      } finally {
        setIPLoading(false);
      }
    }

    checkIp()
      .then(() => {
        if (showOldVersionNotification) {
          Toast.show({
            type: 'info',
            text1: 'Появилась новая версия приложения!',
            text2: 'Кликни чтобы обновиться',
            onPress: onUpdateVersionHandler,
            visibilityTime: 15000,
          });
        }
      })
      .then(() => getLastNews());
  }, []);

  React.useEffect(() => {
    async function observeVpn() {
      if (isIPhone) {
        await RNSimpleOpenvpn.observeState();
      }

      addVpnStateListener(e => {
        setVpnStatus(e.state);
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
      Toast.show({type: 'success', text1: 'Подключено успешно!'});
    }
  }, [vpnStatus]);

  const fillCertForConnect = () => {
    /** Если у пользака нет айпишников и соответственно инстанс не найден - просто возвращаем его профиль, он у него захардкожен */
    if (!pickedInstance) {
      return authData.certificate;
    }
    if (pickedInstance.protocol === 'tcp') {
      return authData.certificate
        .replace('explicit-exit-notify', '')
        .replace('udp', 'tcp')
        .replace(
          '$remotes_here$',
          `remote ${pickedInstance.ip} ${pickedInstance.port}`,
        );
    } else {
      return authData.certificate.replace(
        '$remotes_here$',
        `remote ${pickedInstance.ip} ${pickedInstance.port} ${pickedInstance.protocol}`,
      );
    }
  };

  const onUpdateVersionHandler = async () => {
    setShowOldVersionNotification(false);
    await Linking.openURL(
      'https://play.google.com/store/apps/details?id=com.pepavpn',
    );
  };

  const getLastNews = async () => {
    const news = await API.getNews();
    if (news) {
      const [text1, text2] = news.split('$SEPARATOR');
      Toast.show({type: 'info', text1, text2, visibilityTime: 15000});
    }
  };

  async function startOvpn() {
    try {
      await RNSimpleOpenvpn.connect({
        ovpnString: fillCertForConnect(),
      });
    } catch (error) {
      console.log(error, 'error');
      Toast.show({
        type: 'error',
        text1: 'Ошибка подключения, попробуйте позже!',
      });
    }
  }

  async function stopOvpn() {
    try {
      await RNSimpleOpenvpn.disconnect();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка соединения, попробуйте позже!',
      });
    }
  }

  const toggleVpn = async () => {
    if (isVpnDisconnected) {
      checkPermissions();
      return await startOvpn();
    }
    if (isVpnConnected) {
      return await stopOvpn();
    }
    return await stopOvpn();
  };

  const selectVpnInstance = instance => () => {
    setPickedInstance(instance);
    setShowInstancesMenu(false);
  };

  const goToDonationHandler = async () => {
    const link = config.donationLink || 'https://pay.cloudtips.ru/p/52899e68';
    await Linking.openURL(link);
  };

  const renderLogo = () => {
    if (authData.isSubscriptionActive) {
      return isVpnConnected ? hobo : isVpnDisconnected ? waiting : happy;
    } else {
      return sad;
    }
  };

  const renderWhatsNewButton = () => (
    <View style={{position: 'absolute', top: 0, left: 0}}>
      <Button
        labelStyle={{color: '#ffffff'}}
        onPress={() => setShowWhatsNewDialog(true)}>
        Что нового?
      </Button>
    </View>
  );

  const renderInstanceMenu = () => {
    if (!servers.length) {
      return null;
    }
    return (
      <View style={{position: 'absolute', top: 0, right: 0}}>
        <Menu
          style={{marginTop: 10}}
          visible={showInstancesMenu}
          onDismiss={() => setShowInstancesMenu(false)}
          anchor={
            <Button
              labelStyle={{color: '#ffffff'}}
              onPress={() => setShowInstancesMenu(true)}>
              Выбрать сервер
            </Button>
          }>
          {servers.map(i => (
            <Menu.Item
              titleStyle={{
                color: i.ip === pickedInstance?.ip ? '#D9550D' : 'gray',
              }}
              style={{
                backgroundColor:
                  i.ip === pickedInstance?.ip ? 'orange' : 'white',
              }}
              key={i.ip}
              onPress={selectVpnInstance(i)}
              title={i.name}
            />
          ))}
        </Menu>
      </View>
    );
  };

  const renderProfileName = () => {
    const serverName = pickedInstance?.name || 'PepaVPN';
    return (
      <View style={styles.profileNameContainer}>
        <Text style={styles.profileNameLabel(isVpnConnected)}>
          {authData.isSubscriptionActive
            ? `Сервер: ${serverName}`
            : 'У вас нет активной подписки'}
        </Text>
      </View>
    );
  };

  const checkPermissions = async () => {
    try {
      await PermissionsAndroid.request(
        'android.permission.POST_NOTIFICATIONS',
        {
          title: 'Бип-буп-бац. Это запрос на отображение нотификаций',
          message:
            'Вам не нужны разрешения, чтобы поступать так, как считаете нужным, нам, чтобы показать Вам статистику впн - они нужны.',
          buttonNegative: 'Точно нет',
          buttonPositive: 'Конечно да',
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const renderDonation = () => {
    return (
      <View style={styles.donationContainer(isVpnConnected)}>
        <Text style={styles.donationText}>
          Настали трудные времена. Ночую под мостом, дерусь с голубями за еду,
          собираю бутылки на аренду серверов.
        </Text>
        <Button
          labelStyle={{color: 'white', fontSize: 14}}
          style={{backgroundColor: '#1DC76B', marginTop: 10}}
          onPress={goToDonationHandler}>
          Кинуть сотку в стакан
        </Button>
      </View>
    );
  };

  const renderButton = () => {
    const btnText = isVpnConnected
      ? 'Отключить'
      : isVpnDisconnected
      ? 'Подключить'
      : 'В процессе';

    return (
      <View style={styles.buttonContainer}>
        {authData.isSubscriptionActive ? (
          <Animatable.View
            animation={isVpnDisconnected ? 'shake' : ''}
            iterationCount="infinite"
            duration={2500}
            iterationDelay={3000}>
            <Button
              labelStyle={{color: 'white', fontSize: 20}}
              style={styles.connectButton(isVpnConnected)}
              disabled={restVpnStatuses}
              onPress={toggleVpn}>
              {btnText}
            </Button>
          </Animatable.View>
        ) : (
          <View style={styles.donationContainer(isVpnConnected)}>
            <Text style={styles.donationText}>
              Профиль не активирован, напишите нам в поддержку и мы поможем
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderBody = () => {
    if (isIPLoading) {
      return <Spinner text="Загрузка..." />;
    }
    return (
      <>
        <NewFeaturesDialogue
          hideDialog={() => setShowWhatsNewDialog(false)}
          visible={showWhatsNewDialog}
        />
        {renderWhatsNewButton()}
        {renderInstanceMenu()}
        {isVpnConnected && <Image source={fire} style={styles.fire} />}
        <Image source={city} style={styles.picture} />
        <View style={styles.main}>
          {renderDonation()}
          <Text style={basicStyles.label}>Pepa VPN</Text>
          <PepaLogo
            logo={renderLogo()}
            containerStyles={{
              ...basicStyles.logoContainer,
              ...styles.grayBorder,
            }}
            logoStyles={basicStyles.logo}
          />
          {renderProfileName()}
        </View>
        {renderButton()}
      </>
    );
  };

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
    justifyContent: 'center',
  },
  fire: {
    width: '100%',
    height: '150%',
    position: 'absolute',
    top: -80,
    justifyContent: 'center',
    zIndex: -100,
  },
  picture: {
    borderTopRightRadius: 220,
    borderTopLeftRadius: 220,
    width: '100%',
    height: '30%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  grayBorder: {
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  buttonContainer: {
    marginBottom: 40,
    padding: 10,
  },
  profileNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  profileNameLabel: isVpnConnected => {
    return {
      fontFamily: 'TitilliumWeb-Regular',
      fontSize: 20,
      color: isVpnConnected ? 'black' : 'white',
    };
  },
  donationText: {
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  connectButton: isVpnConnected => {
    const bgColor = isVpnConnected ? '#D9550D' : '#1DC76B';
    return {
      backgroundColor: bgColor,
      padding: 10,
    };
  },
  donationContainer: isVpnConnected => {
    return {
      backgroundColor: isVpnConnected
        ? 'rgba(0,0,0, 0.5)'
        : 'rgba(255,255,255, 0.2)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 8,
      borderColor: isVpnConnected ? '#D9550D' : '#1DC76B',
      padding: 15,
    };
  },
  noProfileText: {
    backgroundColor: '#D9550D',
    padding: 15,
  },
});
