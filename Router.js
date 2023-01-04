import React from 'react';
import {useAuth} from "./Contexts/AuthContext";
import {Spinner} from "./Components/Spinner";
import {NavigationContainer} from "@react-navigation/native";
import {AuthStackScreen} from "./Stacks/AuthStack";
import {AppStack} from "./Stacks/AppStack";

export const Router = () => {
  const { authData, config, loading} = useAuth()

  if (loading) {
    return <Spinner text="Загрузка..." />
  }

  return (
    <NavigationContainer fallback={Spinner}>
      { (authData && config) ? <AppStack /> : <AuthStackScreen />}
    </NavigationContainer>
  )
}
