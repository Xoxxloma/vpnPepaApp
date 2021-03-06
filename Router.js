import React from 'react';
import {useAuth} from "./Contexts/AuthContext";
import {Spinner} from "./Components/Spinner";
import {NavigationContainer} from "@react-navigation/native";
import {AuthStackScreen} from "./Stacks/AuthStack";
import {AppStack} from "./Stacks/AppStack";

export const Router = () => {
  const { authData, loading} = useAuth()

  if (loading) {
    return <Spinner />
  }

  return (
    <NavigationContainer fallback={Spinner}>
      { authData ? <AppStack /> : <AuthStackScreen />}
    </NavigationContainer>
  )
}
