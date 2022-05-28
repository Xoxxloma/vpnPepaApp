import React from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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
      const data = await fetch(`http://185.105.108.208:4003/getClientByAuthCode/${authCode}`).then(r => r.json())
      if (data) {
        await setUser(data)
      } else {
        Toast.show({type: 'error', text1: 'Неправильный код, проверьте правильность ввода или перезапросите код у бота'})
      }
    } catch (e) {
      setError(e)
      console.log(e, "ERROR in sign in")
    }
  }

  async function loadStorageData() {
    try {
      const authData = await AsyncStorage.getItem('user')
      if (authData) {
        setAuthData(JSON.parse(authData))
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
    <AuthContext.Provider value={{ authData, loading, error, signIn, signOut, setUser}}>
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
