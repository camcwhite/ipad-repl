import React, { useContext } from "react";
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../themes";
import { FocusAwareStatusBar } from "./FocusAwareStatusBar";

export const AboutScreen = () => {
  const { activeTheme } = useContext(ThemeContext);

  const backgroundTheme = {
    backgroundColor: activeTheme.colors.backgroundPrimary,
  }

  const fontTheme = {
    color: activeTheme.colors.fontPrimary,
  }

  const ListItem = ({ text }: { text: string }) => (
    <Text style={StyleSheet.flatten([styles.paragraph, fontTheme])}>
      {`\n\t\t\u2022 ${text}`}
    </Text>
  );

  const LinkButton = ({ text, url }: { text: string, url: string }) => {
    const openLink = async () => {
      const linkingSupported = await Linking.canOpenURL(url);
      if (linkingSupported) {
        await Linking.openURL(url);
      }
      else {
        Alert.alert("Can't open link :(", url);
      }
    }

    return (
      <TouchableOpacity style={{'marginTop': 10}} onPress={openLink}>
        <Text style={StyleSheet.flatten([styles.paragraph, fontTheme, styles.link])}>
          {text}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, backgroundTheme])}>
      <FocusAwareStatusBar barStyle={activeTheme.dark ? "light-content" : "dark-content"} />
      <ScrollView style={StyleSheet.flatten([styles.scrollContainer, backgroundTheme])} contentContainerStyle={styles.scrollContent}>
        <Text style={StyleSheet.flatten([styles.sectionHeader, fontTheme])}>Controls</Text>
        <Text style={StyleSheet.flatten([styles.paragraph, fontTheme])}>
          This app was built primarily to accompany my workflow which uses an iPad with an Apple Magic Keyboard, so there are some shortcuts in the REPL:
        </Text>
        <ListItem text={"Clear console: Option + 'K' (˚ character)"} />
        <ListItem text={"Previous command: Option + ';' (… character)"} />
        <ListItem text={"Next command: Option + '.' (≥ character)"} />

        <Text style={StyleSheet.flatten([styles.sectionHeader, fontTheme])}>About</Text>
        <Text style={StyleSheet.flatten([styles.paragraph, fontTheme])}>
          This is a simple REPL for iPad/iPhone. Currently, Python 3 is the only supported language, but this will change in the future. If you have a request for a language or any questions, email me:
        </Text>
        <LinkButton text={'✉️ whiteceric@gmail.com'} url={'mailto:whiteceric@gmail.com'} />
        <Text style={StyleSheet.flatten([styles.sectionHeader, fontTheme])}>Support</Text>
        <LinkButton text={'☕ Buy me a coffee :)'} url={'https://www.buymeacoffee.com/camwhite'} />
        <Text style={StyleSheet.flatten([styles.sectionHeader, fontTheme])}>Contribute</Text>
        <Text style={StyleSheet.flatten([styles.paragraph, fontTheme])}>
          This app is open source! There is currently not an android version, so if you fork to release on android, all I ask for is credit.
        </Text>
        <LinkButton text={'Contribute on GitHub'} url={'https://github.com/whiteceric/ipad-repl'} />
        <View style={styles.bottomMargin}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
    maxWidth: 683,
    marginTop: '3%',
    paddingHorizontal: 10,
  },
  scrollContent: {
    alignItems: 'flex-start',
  },
  sectionHeader: {
    fontFamily: 'Arial',
    fontSize: 40,
    marginBottom: 10,
    marginTop: 40,
  },
  paragraph: {
    fontFamily: 'Arial',
    fontSize: 20,
  },
  link: {
    color: '#007AFF',
  },
  bottomMargin: {
    marginBottom: 300,
  },
});