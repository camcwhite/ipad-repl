import React, { useEffect, useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { REPLScreen } from './components/REPLScreen';
import { AboutScreen } from './components/AboutScreen';

import { Colors, useTheme } from './assets/colors';
import { SettingsScreen } from './components/SettingsScreen';


export type StackParamList = {
  Home: undefined;
  REPLScreen: { language: string }
}

// const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator();

export default function App() {
  const activeTheme = useTheme();

  const backgroundTheme = {
    backgroundColor: activeTheme.colors.backgroundPrimary,
  }

  console.log('app', activeTheme.name);
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: StyleSheet.flatten([styles.drawerStyle, backgroundTheme]),
          drawerActiveTintColor: Colors.textBackground,
          drawerLabelStyle: StyleSheet.flatten([styles.drawerLabelStyle, { color: activeTheme.colors.secondary }]),
        }}
      >
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Drawer.Screen name="REPLScreen" component={REPLScreen} options={
          {
            headerShown: true,
            headerTitle: 'Python3',
            title: 'REPL',
            headerStyle: StyleSheet.flatten([styles.headerContainer, backgroundTheme]),
            headerTintColor: activeTheme.colors.primary,
          }
        } />

        <Drawer.Screen name="Settings" component={SettingsScreen} options={
          {
            headerShown: true,
            headerStyle: StyleSheet.flatten([styles.headerContainer, backgroundTheme]),
            headerTintColor: activeTheme.colors.tertiary,
          }
        } />

        <Drawer.Screen name="About" component={AboutScreen} options={
          {
            headerShown: true,
            headerStyle: StyleSheet.flatten([styles.headerContainer, backgroundTheme]),
            headerTintColor: Colors.tertiary,
          }
        } />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function CustomDrawerContent(props: any) {
  const activeTheme = useTheme();
  console.log('header', activeTheme.name);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label='iREPL'
        style={styles.drawerTitleView}
        labelStyle={StyleSheet.flatten([styles.drawerTitle, { color: activeTheme.colors.secondary }])}
        onPress={() => { }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
  },
  drawerStyle: {
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
  },
});