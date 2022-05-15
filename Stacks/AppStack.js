import React from 'react';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import MainScreen from "../Screens/MainScreen";
import { ProfileScreen } from '../Screens/ProfileScreen'
import {useAuth} from "../Contexts/AuthContext";
import Icon from "react-native-vector-icons/AntDesign";
import {ShoppingCartScreen} from "../Screens/ShoppingCartScreen";


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const {signOut} = useAuth()

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
        <DrawerItem
          label="Выход"
          labelStyle={{fontSize: 17}}
          onPress={() => signOut()}
          style={{paddingVertical: 10}}
          icon={({focused}) => <Icon name="logout" size={30} color={focused ? "#D9550D" : 'gray'} />}
        />
    </DrawerContentScrollView>
  )
}

export function AppStack () {
  return (
    <Drawer.Navigator
      screenOptions={{
        tabBarStyle: {display: 'none'},
        drawerActiveTintColor: '#D9550D',
        drawerActiveBackgroundColor: '#F1C829',
        drawerStyle: { backgroundColor: 'white' },
        drawerItemStyle: { paddingVertical: 10 },
        drawerLabelStyle: { fontSize: 17 },
        headerStyle: {
          backgroundColor: 'black',
          height: 60,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 20,
          color: '#D9550D'
        },
        headerTintColor: '#D9550D'
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="MainPage" component={MainScreen} options={{ headerShown: false, title: 'Главная страница', drawerIcon: ({focused}) => <Icon name="home" size={30} color={focused ? "#D9550D" : 'gray' } /> }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль', drawerIcon: ({focused}) => <Icon name="user" size={30} color={focused ? "#D9550D" : 'gray' }  /> }}  />
      <Drawer.Screen name="Shop" component={ShoppingCartScreen} options={{title: 'Купить подписку', drawerIcon: ({focused}) => <Icon name="shoppingcart" size={30} color={focused ? "#D9550D" : 'gray' }  /> }}  />
    </Drawer.Navigator>
  )
}
