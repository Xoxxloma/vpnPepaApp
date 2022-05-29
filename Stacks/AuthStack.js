import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {LoginForm} from "../Components/LoginForm";
import {RegistrationForm} from "../Components/RegistrationForm";

const AuthStack = createNativeStackNavigator()

export function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Registration" component={RegistrationForm} />
      <AuthStack.Screen name="Login" component={LoginForm} />
    </AuthStack.Navigator>
  )
}
