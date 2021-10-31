import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { HomeScreen } from './components/HomeScreen';
import { REPLScreen } from './components/REPLScreen';
import { getActiveTheme, loadActiveTheme } from './config';
import { SettingsScreen } from './components/SettingsScreen';
import { getTheme, useTheme } from './themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsImage = require('./assets/settings.png');

export type StackParamList = {
  Home: undefined;
  REPLScreen: { language: string }
}

const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator();

export default function App() {
  const [activeTheme, setActiveTheme] = useState(getTheme('Monokai'));

  const loadTheme = async () => {
    const theme = await AsyncStorage.getItem('@active_theme');
    if (theme !== null)
      setActiveTheme(getTheme(theme));
  }
  useEffect(() => {
    // setActiveTheme(useTheme());
    loadTheme();
  }, []);

  console.log(`Active theme in App.tsx: ${activeTheme.name}`);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...{ ...props, activeTheme }} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: styles.drawerStyle,
          drawerActiveTintColor: getActiveTheme().colors.textBackground,
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
            headerTintColor: activeTheme.colors.primary,
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.headerSettingsButton}
                onPress={() => alert('This is a button!')}
              >
                <Image
                  style={styles.settingsImage}
                  source={settingsImage}
                />
              </TouchableOpacity>
            ),
          }
        } />

        <Drawer.Screen name="Settings" component={SettingsScreen} options={
          {
            headerShown: true,
            title: 'Settings',
            headerStyle: styles.headerContainer,
            headerTintColor: activeTheme.colors.tertiary,
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
        labelStyle={{ ...styles.drawerTitle, color: props.activeTheme.colors.secondary }}
        onPress={() => { }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: getActiveTheme().colors.backgroundPrimary,
  },
  headerSettingsButton: {
    marginRight: 10,
  },
  settingsImage: {
    width: 20,
    height: 20,
    tintColor: getActiveTheme().colors.primary,
  },
  drawerStyle: {
    backgroundColor: getActiveTheme().colors.backgroundPrimary,
  },
  drawerTitleView: {
    marginBottom: '20%',
  },
  drawerTitle: {
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    fontSize: 48,
    textAlign: 'center',
  },
  drawerLabelStyle: {
    fontFamily: 'Arial',
    color: getActiveTheme().colors.secondary,
  },
});