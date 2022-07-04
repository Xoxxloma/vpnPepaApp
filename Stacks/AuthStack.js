import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {LoginFormScreen} from "../Screens/LoginFormScreen";

const AuthStack = createNativeStackNavigator()

export function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={LoginFormScreen} />
    </AuthStack.Navigator>
  )
}
