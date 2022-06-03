import 'react-native-gesture-handler';
import React from 'react'
import {AuthProvider} from "./Contexts/AuthContext";
import {Router} from "./Router";
import Toast from "react-native-toast-message";


export default function App () {

  return (
    <AuthProvider>
      <Router />
      <Toast />
    </AuthProvider>
  )
}
