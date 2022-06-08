import 'react-native-gesture-handler';
import React from 'react'
import {AuthProvider} from "./Contexts/AuthContext";
import {Router} from "./Router";
import Toast from "react-native-toast-message";
import { Provider as PaperProvider } from 'react-native-paper';
import {toastConfig} from "./Utils/toastConfig";


export default function App () {

  return (
    <PaperProvider>
      <AuthProvider>
        <Router />
        <Toast config={toastConfig} topOffset={100} />
      </AuthProvider>
    </PaperProvider>
  )
}
