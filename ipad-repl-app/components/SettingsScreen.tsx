import React, { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, ScrollView, View, KeyboardAvoidingView, Platform, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { FocusAwareStatusBar } from "./FocusAwareStatusBar";
import { FontContext, getAllThemes, Theme } from "../themes";
import { saveNumber, saveString, } from "../storage";
import { ACTIVE_THEME, EDITOR_FONT_SIZE } from "../storageKeys";
import { ThemeContext } from "../themes";

const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 56;

export const SettingsScreen = () => {
  const { activeTheme, activeThemeKey:selectedTheme, changeTheme: onThemeChange } = useContext(ThemeContext);

  // settings
  // const [selectedTheme, setSelectedTheme] = useState(activeTheme.name);
  const { fontSize: selectedFontSize, setFontSize: setSelectedFontSize } = useContext(FontContext);

  // display
  const allThemes = [...getAllThemes()];
  const [displayedFontSize, setDisplayedFontSize] = useState(`${selectedFontSize}`);


  const changeFontSize = (newFontSize: number) => {
    const safeNewFontSize = Math.min(Math.max(newFontSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
    setSelectedFontSize(safeNewFontSize);
    setDisplayedFontSize(`${safeNewFontSize}`);
    saveNumber(EDITOR_FONT_SIZE, safeNewFontSize);
  }

  const parseFontSize = (fontSizeStr: string) => {
    let newFontSize;
    if (fontSizeStr.match(/\d\d?/) == null) {
      newFontSize = 0;
    }
    else {
      newFontSize = parseInt(fontSizeStr);
    }
    changeFontSize(newFontSize);
  }

  const incrementFontSize = (inc: number) => {
    changeFontSize(selectedFontSize + inc);
  }

  const setActiveTheme = (newTheme: string) => {
    saveString(ACTIVE_THEME, newTheme).then(() => {
      onThemeChange(newTheme)
    });
  }

  const dynamicStyles = StyleSheet.create({
    sampleFontText: {
      fontFamily: 'Courier New',
      fontWeight: 'bold',
      fontSize: selectedFontSize,
      color: activeTheme.colors.fontPrimary,
    },
  });

  const fontTheme = {
    color: activeTheme.colors.fontPrimary,
  }

  const backgroundTheme = {
    backgroundColor: activeTheme.colors.backgroundPrimary,
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={useHeaderHeight() + 20}
      style={StyleSheet.flatten([styles.container, backgroundTheme])}>
      <FocusAwareStatusBar barStyle={activeTheme.dark ? "light-content" : "dark-content"} />
      <ScrollView style={StyleSheet.flatten([styles.scrollContainer, backgroundTheme])}>
        <View style={styles.sectionContainer}>
          <Text style={StyleSheet.flatten([styles.sectionHeader, fontTheme])}>Theme</Text>
          {allThemes.map(([key, theme]: [string, Theme], index: number) => (
            (<TouchableOpacity
              key={index} style={styles.themeSelect}
              onPress={() => setActiveTheme(key)}>
              <Image source={theme.preview} style={StyleSheet.flatten([styles.themePreview, { 'borderColor': activeTheme.colors.backgroundContrast }])} />
              <View
                style={{
                  ...styles.themeSelectButton,
                  backgroundColor: (selectedTheme === key ? activeTheme.colors.tertiary : activeTheme.colors.backgroundPrimary)
                }}
              ></View>
              <Text style={StyleSheet.flatten([styles.themeSelectText, fontTheme])}>{theme.name}</Text>
            </TouchableOpacity>)
          ))}
        </View>
        <View style={styles.sectionContainer}>
          <Text style={StyleSheet.flatten([styles.sectionHeader, fontTheme])}>Editor Font</Text>
          <View style={StyleSheet.flatten([styles.sampleFontContainer, { borderColor: activeTheme.colors.fontPrimary }])}>
            <Text style={StyleSheet.flatten([dynamicStyles.sampleFontText, fontTheme])} > The quick brown fox did what now?</Text>
          </View>
          <View style={styles.fontSizeSelectContainer}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => incrementFontSize(-1)}
            >
              <Text style={StyleSheet.flatten([styles.selectButtonText, fontTheme])}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={StyleSheet.flatten([styles.fontSizeSelectInput, fontTheme, { borderColor: activeTheme.colors.fontPrimary }])}
              keyboardType={'numeric'}
              onChangeText={(text) => setDisplayedFontSize(text.replace(/[^0-9]/, ''))}
              onEndEditing={() => parseFontSize(displayedFontSize.replace(/[^0-9]/, '0'))}
              maxLength={2}
              textAlign={'right'}
              selectionColor={activeTheme.colors.tertiary}
              selectTextOnFocus={true}
              value={displayedFontSize} />
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => incrementFontSize(1)}
            >
              <Text style={StyleSheet.flatten([styles.selectButtonText, fontTheme])}>+</Text>
            </TouchableOpacity>
          </View >
        </View>
      </ScrollView>
    </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
    maxWidth: 1366 / 2,
    marginTop: '3%',
    paddingLeft: 10,
  },
  sectionContainer: {
    marginVertical: '3%',
  },
  sectionHeader: {
    fontFamily: 'Arial',
    fontSize: 56,
  },
  sampleFontContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '5%',
    height: 150,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  fontSizeSelectContainer: {
    fontFamily: 'Arial',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selectButton: {
    marginHorizontal: 10,
    width: 100,
  },
  selectButtonText: {
    textAlign: 'center',
    fontSize: 56,
  },
  fontSizeSelectInput: {
    fontSize: 56,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  themeSelect: {
    display: 'flex',
    flex: 1,
    marginVertical: '5%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeSelectButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  themeSelectText: {
    // textAlign: 'center',
    fontSize: 40,
  },
  themePreview: {
    width: 367,
    height: 275,
    resizeMode: 'contain',
    borderWidth: 1,
  },
});