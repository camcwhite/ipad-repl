import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerNavigationProp } from '@react-navigation/drawer';
import { REPLScreen } from './components/REPLScreen';
import { AboutScreen } from './components/AboutScreen';
import { getTheme, ThemeContext, FontContext, DEFAULT_THEME, DEFAULT_FONT_SIZE } from './themes';
import { SettingsScreen } from './components/SettingsScreen';
import { loadNumber, loadString } from './storage';
import { ACTIVE_THEME, EDITOR_FONT_SIZE } from './storageKeys';

const Drawer = createDrawerNavigator();

export type DrawerParamList = {
  REPLScreen: undefined,
  SettingsScreen: undefined,
  AboutScreen: undefined,
}

export default function App() {
  const [activeTheme, setActiveTheme] = useState(getTheme(DEFAULT_THEME));
  const [activeThemeKey, setActiveThemeKey] = useState(DEFAULT_THEME);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  // load settings
  useEffect(() => {
    loadString(ACTIVE_THEME).then((activeThemeName) => {
      setActiveThemeKey(activeThemeName);
      setActiveTheme(getTheme(activeThemeName));
    }
    );

    loadNumber(EDITOR_FONT_SIZE).then((activeFontSize) =>
      setFontSize(activeFontSize)
    );
  }, []);

  const changeTheme = (newThemeName: string) => {
    setActiveThemeKey(newThemeName);
    setActiveTheme(getTheme(newThemeName));
  }

  const backgroundTheme = {
    backgroundColor: activeTheme.colors.backgroundPrimary,
  }

  return (
    <ThemeContext.Provider value={{ activeTheme, activeThemeKey, changeTheme }}>
      <FontContext.Provider value={{ fontSize, setFontSize }}>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              headerShown: false,
              drawerStyle: StyleSheet.flatten([styles.drawerStyle, backgroundTheme]),
              drawerActiveTintColor: activeTheme.colors.backgroundContrast,
              drawerLabelStyle: StyleSheet.flatten([styles.drawerLabelStyle, { color: activeTheme.colors.secondary }]),
            }}
          >
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
            <Drawer.Screen name="REPLScreen" component={REPLScreen} options={
              {
                headerShown: true,
                headerTitle: 'Python3',
                title: 'REPL',
                headerStyle: StyleSheet.flatten([styles.headerContainer, backgroundTheme, { 'shadowColor': activeTheme.colors.primary }]),
                headerTintColor: activeTheme.colors.primary,
              }
            } />

            <Drawer.Screen name="Settings" component={SettingsScreen} options={
              {
                headerShown: true,
                headerStyle: StyleSheet.flatten([styles.headerContainer, backgroundTheme, { 'shadowColor': activeTheme.colors.tertiary }]),
                headerTintColor: activeTheme.colors.tertiary,
              }
            } />

            <Drawer.Screen name="About" component={AboutScreen} options={
              {
                headerShown: true,
                headerStyle: StyleSheet.flatten([styles.headerContainer, backgroundTheme, { 'shadowColor': activeTheme.colors.secondary }]),
                headerTintColor: activeTheme.colors.secondary,
              }
            } />
          </Drawer.Navigator>
        </NavigationContainer>
      </FontContext.Provider>
    </ThemeContext.Provider>
  );
}

function CustomDrawerContent(props: any) {
  const { activeTheme } = useContext(ThemeContext);
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