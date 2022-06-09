import React from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {shouldUpdateAuthData} from "../Utils/helpers";
import {axiosInstance} from "../services/axiosInstance";

const AuthContext = React.createContext({})

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    loadStorageData()
  }, [])

  const setUser = async (user) => {
    setAuthData(user)
    await AsyncStorage.setItem('user', JSON.stringify(user))
  }

  const signIn = async (authCode) => {
    try {
      const { data } = await axiosInstance.get(`getClientByAuthCode/${authCode}`)
      if (data) {
        await setUser(data)
      }
    } catch (e) {
      setError(e)
      console.log(e, 'error')
      Toast.show({type: 'error', text1: 'Ошибка логина', text2: 'Попробуйте снова или перезагрузите приложение!' })
    }
  }

  async function loadStorageData() {
    try {
      const authData = await AsyncStorage.getItem('user')
      const parsedAuthData = JSON.parse(authData);

      if (authData) {
        if (shouldUpdateAuthData(parsedAuthData.expiresIn)) {
          await signIn(parsedAuthData.authCode)
          Toast.show({type: 'warning', text1: 'Алярм Алярм, подписка заканчивается сегодня!', text2: 'Но в магазине их еще много, убедись сам.', visibilityTime: 10000 })
        } else {
          setAuthData(parsedAuthData)
        }
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await AsyncStorage.removeItem('user')
    setAuthData(null)
  }

  return (
    <AuthContext.Provider value={{ authData, loading, error, signIn, signOut, setUser, setAuthData}}>
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
