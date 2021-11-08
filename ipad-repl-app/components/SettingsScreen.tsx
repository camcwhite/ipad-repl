import React, { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { FocusAwareStatusBar } from "./FocusAwareStatusBar";
import { getAllThemes, Theme } from "../themes";
import { useTheme } from "react-native-paper";
import { REPLScreenNavigationProp } from "./REPLScreen";
import { saveNumber, saveString, } from "../storage";
import { ACTIVE_THEME, EDITOR_FONT_SIZE } from "../storageKeys";
import { useNavigation, useRoute } from "@react-navigation/core";
import { ThemeContext } from "../themes";

const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 56;

export const SettingsScreen = () => {
  // const route = useRoute();
  // console.log(route.params.onThemeChange);

  // settings
  const [selectedTheme, setSelectedTheme] = useState("monokai");
  const [selectedFontSize, setSelectedFontSize] = useState(24);

  // display
  const allThemes = getAllThemes();
  const [displayedFontSize, setDisplayedFontSize] = useState(`${selectedFontSize}`);

  const {activeTheme, changeTheme:onThemeChange} = useContext(ThemeContext);

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
    setSelectedTheme(newTheme);
    saveString(ACTIVE_THEME, newTheme);
    onThemeChange(newTheme);
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
          {allThemes.map((theme: Theme, index: number) => (
            (<TouchableOpacity
              key={index} style={styles.themeSelect}
              onPress={() => setActiveTheme(theme.name)}>
              <View
                style={{
                  ...styles.themeSelectButton,
                  backgroundColor: (selectedTheme === theme.name ? activeTheme.colors.tertiary : activeTheme.colors.backgroundSecondary)
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
    width: '50%',
    marginTop: '3%',
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  themeSelectButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  themeSelectText: {
    fontSize: 40,
  },
});