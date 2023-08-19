import React from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { shouldUpdateAuthData } from "../Utils/helpers";
import { API } from "../services/axiosInstance";
import dayjs from "dayjs";
import VersionInfo from "react-native-version-info";

const AuthContext = React.createContext({})

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = React.useState(null)
  const [config, setConfig] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    loadStorageData()
  }, [])

  const setUser = async (user) => {
    setAuthData(user)
    await AsyncStorage.setItem('user', JSON.stringify(user))
  }

  const setConfigToStorage = async (config) => {
    setConfig(config)
    await AsyncStorage.setItem('config', JSON.stringify(config))
  }

  const signIn = async (authCode) => {
    try {
      setLoading(true)
      const data = await API.getClientByAuthCode(authCode)
      const configData = await API.getConfig()
      if (VersionInfo.appVersion !== data.appVersion) {
        await API.setAppVersion(data.telegramId, VersionInfo.appVersion)
      }
      if (data && configData) {
        await setUser(data)
        await setConfigToStorage(configData)
        await AsyncStorage.setItem('lastTimeConfigUpdated', JSON.stringify(dayjs()))
      }
    } catch (e) {
      console.log(e, 'error')
      setError(e)
      Toast.show({type: 'error', text1: 'Ошибка логина', text2: 'Попробуйте снова или перезагрузите приложение!' })
    }
    finally {
      setLoading(false)
    }
  }

  async function loadStorageData() {
    try {
      setLoading(true)
      const lastTimeConfigUpdated = await AsyncStorage.getItem('lastTimeConfigUpdated')
      const authData = await AsyncStorage.getItem('user')
      const config = await AsyncStorage.getItem('config')
      const parsedAuthData = JSON.parse(authData);
      const parsedConfig = JSON.parse(config);
      const parsedLastTimeConfigUpdated = JSON.parse(lastTimeConfigUpdated)
      const shouldUpdateData = shouldUpdateAuthData(parsedLastTimeConfigUpdated)

      if (authData && config) {
        if (shouldUpdateData) {
          await signIn(parsedAuthData.authCode)
        } else {
          setAuthData(parsedAuthData)
          setConfig(parsedConfig)
        }
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await AsyncStorage.removeItem('user')
    await AsyncStorage.removeItem('pollingBillId')
    await AsyncStorage.removeItem('config')
    setAuthData(null)
    setConfig(null)
  }

  return (
    <AuthContext.Provider value={{ authData, loading, error, signIn, signOut, setUser, setAuthData, config}}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context;
}

export { AuthContext, AuthProvider, useAuth }
