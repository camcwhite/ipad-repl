import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { REPLScreen } from './components/REPLScreen';
import { AboutScreen } from './components/AboutScreen';

import { Colors } from './assets/colors';


export type StackParamList = {
  Home: undefined;
  REPLScreen: { language: string }
}

// const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator();

export default function App() {
  const [data, setData] = useState("")

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

function CustomDrawerContent(props:any) {
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