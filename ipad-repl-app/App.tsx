import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { HomeScreen } from './components/HomeScreen';
import { REPLScreen } from './components/REPLScreen';
import { AboutScreen } from './components/AboutScreen';

import { Colors } from './assets/colors';

const settingsImage = require('./assets/settings.png');

export type StackParamList = {
  Home: undefined;
  REPLScreen: { language: string }
}

const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ 
          headerShown: false,
          drawerStyle: styles.drawerStyle,
          drawerActiveTintColor: Colors.textBackground,
          drawerLabelStyle: styles.drawerLabelStyle,
        }}
      >
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Drawer.Screen name="REPLScreen" component={REPLScreen} options={
          {
            headerShown: true,
            headerTitle: 'Python3',
            title: 'REPL',
            headerStyle: styles.headerContainer,
            headerTintColor: Colors.primary,
            // headerRight: () => (
            //   <TouchableOpacity
            //     activeOpacity={0.7}
            //     style={styles.headerSettingsButton}
            //     onPress={() => alert('This is a button!')}
            //   >
            //     <Image
            //       style={styles.settingsImage}
            //       source={settingsImage}
            //     />
            //   </TouchableOpacity>
            // ),
          }
        } />

        <Drawer.Screen name="About" component={AboutScreen} options={
          {
            headerShown: true,
            headerStyle: styles.headerContainer,
            headerTintColor: Colors.tertiary,
          }
        } />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label='iREPL'
        style={styles.drawerTitleView}
        labelStyle={styles.drawerTitle}
        onPress={() => { }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.backgroundPrimary,
  },
  headerSettingsButton: {
    marginRight: 10,
  },
  settingsImage: {
    width: 20,
    height: 20,
    tintColor: Colors.primary,
  },
  drawerStyle: {
    backgroundColor: Colors.backgroundPrimary,
  },
  drawerTitleView: {
    marginBottom: '20%',
  },
  drawerTitle: {
    color: Colors.secondary,
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 48,
    textAlign: 'center',
  },
  drawerLabelStyle: {
    fontFamily: 'Arial',
    color: Colors.secondary,
  },
});