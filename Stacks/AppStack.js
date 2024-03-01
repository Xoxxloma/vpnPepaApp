import React from 'react';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from "@react-navigation/drawer";
import MainScreen from "../Screens/MainScreen";
import { ProfileScreen } from '../Screens/ProfileScreen'
import {useAuth} from "../Contexts/AuthContext";
import Icon from "react-native-vector-icons/AntDesign";
import {ShoppingCartScreen} from "../Screens/ShoppingCartScreen";
import {FeedbackScreen} from "../Screens/FeedbackScreen";
import {AboutThisAppScreen} from "../Screens/AboutThisAppScreen";
import {IconButton} from "react-native-paper";

const Drawer = createDrawerNavigator();

function CustomDrawerIcon({focused, iconName}) {
  return <Icon name={iconName} size={30} color={focused ? "#D9550D" : 'gray' } />
}

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
          icon={({focused}) => <CustomDrawerIcon focused={focused} iconName="logout" />}
        />
    </DrawerContentScrollView>
  )
}

export function AppStack () {
  const {signIn, authData} = useAuth()

  return (
    <Drawer.Navigator
      screenOptions={{
        tabBarStyle: {display: 'none'},
        drawerActiveTintColor: '#D9550D',
        drawerActiveBackgroundColor: 'orange',
        drawerStyle: { backgroundColor: 'white' },
        drawerItemStyle: { paddingVertical: 10 },
        drawerLabelStyle: { fontSize: 17 },
        headerStyle: {
          backgroundColor: 'orange',
          height: 80,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 20,
          color: '#D9550D',
        },
        headerTintColor: '#D9550D',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="MainPage"
        component={MainScreen}
        options={{
          title: 'Главная страница',
          headerRight: () => <IconButton icon="refresh" size={30} color='#D9550D' onPress={() => signIn(authData.authCode)} />,
          drawerIcon: ({focused}) => <CustomDrawerIcon focused={focused} iconName="home" />
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Профиль',
          drawerIcon: ({focused}) => <CustomDrawerIcon focused={focused} iconName="user" />
        }}
      />
      <Drawer.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          title: 'Задать вопрос',
          drawerIcon: ({focused}) => <CustomDrawerIcon focused={focused} iconName="notification" />
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutThisAppScreen}
        options={{
          title: 'О приложении',
          drawerIcon: ({focused}) => <CustomDrawerIcon focused={focused} iconName="tag" />
        }}
      />
    </Drawer.Navigator>
  )
}
