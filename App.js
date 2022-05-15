import 'react-native-gesture-handler';
import React from 'react'
import {AuthProvider} from "./Contexts/AuthContext";
import {Router} from "./Router";



export default function App () {

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}
