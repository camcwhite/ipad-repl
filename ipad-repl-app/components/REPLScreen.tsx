import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Text,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { REPLSession } from "../models/pythonREPL";
import { FocusAwareStatusBar } from "./FocusAwareStatusBar";
import { FontContext, ThemeContext } from "../themes";
import { DrawerParamList } from "../App";
import { DrawerNavigationProp } from "@react-navigation/drawer";

const refreshImage = require('../assets/refresh.png');

const START_PREFIX = '>>> ';
const CONTINUED_PREFIX = '... ';
const CLEAR_CONSOLE_KEY = '˚';
const UP_ARROW_KEY = '…';
const DOWN_ARROW_KEY = '≥';
const SPECIAL_CHARS = new Set([CLEAR_CONSOLE_KEY, UP_ARROW_KEY, DOWN_ARROW_KEY]);
const getPrefix = (index: number) => (index === 0) ? START_PREFIX : CONTINUED_PREFIX;

type REPLScreenNavProp = DrawerNavigationProp<DrawerParamList>;

export const REPLScreen = ({ navigation }: {navigation: REPLScreenNavProp }) => {
  const [consoleHistory, setConsoleHistory] = useState<string[]>([]);
  const [consoleEditText, setConsoleEditText] = useState([""]);
  const [consoleHistoryDisplay, setConsoleHistoryDisplay] = useState<string[]>([]);
  const [consoleEditNewLines, setConsoleEditNewLines] = useState(0);
  const [consoleHistoryIndex, setConsoleHistoryIndex] = useState(-1);
  const [consoleEditTextCache, setConsoleEditTextCache] = useState("");
  const [replSession, setReplSession] = useState<REPLSession | undefined>(undefined);
  const [commandSent, setCommandSent] = useState(false);
  const consoleHistoryScrollView = useRef<ScrollView>(null);

  // appearance settings
  const {activeTheme} = useContext(ThemeContext);
  const {fontSize:consoleTextSize} = useContext(FontContext);

  const backgroundTheme = {
    backgroundColor: activeTheme.colors.backgroundPrimary,
  }

  const storedStyles = StyleSheet.create({
    consoleText: {
      ...styles.consoleText,
      fontSize: consoleTextSize,
      color: activeTheme.colors.fontPrimary,
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerButton}
          onPress={() => Alert.alert("New REPL Session?", "All defined variables/functions will be reset.",
            [{ text: "Cancel", style: 'cancel' }, { text: "Yes", onPress: newREPLSession, style: 'destructive'}])}
        >
          <Image
            style={StyleSheet.flatten([styles.headerButtonImage, {tintColor: activeTheme.colors.primary}])}
            source={refreshImage}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, activeTheme])

  useEffect(() => {
    newREPLSession();
  }, [])

  const newREPLSession = () => {
    setReplSession(new REPLSession());
    clearConsole();
  }

  const clearConsole = () => {
    setConsoleHistoryDisplay([]);
  }

  const incrementHistoryIndex = (increment: number): void => {
    let newConsoleEditText = undefined;
    if (consoleHistoryIndex === 0 && increment === -1 ||
      consoleHistoryIndex === -1 && increment === 1) return;
    if (consoleHistoryIndex === -1 && increment === -1) {
      setConsoleHistoryIndex(consoleHistory.length - 1);
      setConsoleEditTextCache(consoleEditText.slice(-1)[0]);
      newConsoleEditText = consoleHistory[consoleHistory.length - 1];
    }
    else if (consoleHistoryIndex >= consoleHistory.length - 1 && increment === 1) {
      setConsoleHistoryIndex(-1);
      newConsoleEditText = consoleEditTextCache;
    }
    else if (consoleHistoryIndex !== -1) {
      newConsoleEditText = consoleHistory[consoleHistoryIndex + increment];
      setConsoleHistoryIndex(consoleHistoryIndex + increment);
    }
    if (newConsoleEditText !== undefined) {
      setConsoleEditText([...consoleEditText.slice(0, -1), newConsoleEditText]);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={useHeaderHeight() + 20}
      style={StyleSheet.flatten([styles.outerContainer, backgroundTheme])}
    >
      <SafeAreaView style={styles.container} onTouchStart={Keyboard.dismiss}>
        <FocusAwareStatusBar barStyle={activeTheme.dark ? "light-content" : "dark-content"}/>
        <View style={styles.consoleContainer}>
          <ScrollView
            style={styles.historyContainer}
            ref={consoleHistoryScrollView}
            onContentSizeChange={() => (consoleHistoryScrollView.current) ? consoleHistoryScrollView.current.scrollToEnd({ animated: true }) : {}}
          >
            {consoleHistoryDisplay.map((text: string, index: number) => {
              return (
                <Text key={index} style={storedStyles.consoleText}>{text}</Text>
              );
            })}
          </ScrollView>
          <View style={styles.consoleInputContainer}>
            <Text style={{ ...storedStyles.consoleText, ...(commandSent ? { color: activeTheme.colors.primary } : {}) }}>
              {getPrefix(consoleEditText.length - 1)}
            </Text>
            <TextInput
              style={{ ...storedStyles.consoleText, width: '100%', ...(commandSent ? { color: activeTheme.colors.primary } : {}) }}
              autoCorrect={false}
              autoCapitalize="none"
              multiline={true}
              numberOfLines={1}
              scrollEnabled={true}
              keyboardType={'ascii-capable'}
              autoFocus={true}
              value={consoleEditText.slice(-1)[0]}
              selectionColor={activeTheme.colors.primary}
              onChangeText={(newText) => {
                if (newText.slice(-1) === '\t')
                  newText = newText.slice(0, -1) + '    ';
                if (newText.slice(-1) === CLEAR_CONSOLE_KEY)
                  clearConsole();
                else if (newText.slice(-1) === UP_ARROW_KEY) {
                  incrementHistoryIndex(-1);
                }
                else if (newText.slice(-1) === DOWN_ARROW_KEY) {
                  incrementHistoryIndex(1);
                }
                else if (newText.slice(-1) !== '\n') {
                  setConsoleEditText([...consoleEditText.slice(0, -1), newText]);
                }
              }}
              onKeyPress={(event) => {
                if (event.nativeEvent.key === 'Enter' && replSession !== undefined && replSession.isReady()) {
                  setCommandSent(true);
                  replSession.sendCode(consoleEditText, (response) => {
                    setCommandSent(false);
                    if (response.inputFinished()) {
                      const responseText = response.responseText();
                      const prefix = getPrefix(consoleEditText.length - 1);
                      setConsoleHistory([
                        ...consoleHistory,
                        ...consoleEditText,
                      ]);
                      setConsoleHistoryDisplay([
                        ...consoleHistoryDisplay,
                        prefix + consoleEditText.slice(-1)[0],
                        ...(responseText.length > 0 ? [responseText] : [])
                      ]);
                      setConsoleHistoryIndex(-1);
                      setConsoleEditText([""]);
                      setConsoleEditNewLines(0);
                    }
                    else {
                      setConsoleEditNewLines(consoleEditNewLines + 1);
                      setConsoleHistoryDisplay([
                        ...consoleHistoryDisplay,
                        ...consoleEditText.slice(-1).map((text) => getPrefix(consoleEditText.length - 1) + text)]);
                      setConsoleEditText([
                        ...consoleEditText, ""
                      ]);
                    }
                  })
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 10,
  },
  headerButtonImage: {
    width: 20,
    height: 20,
  },
  outerContainer: {
    flex: 1,
  },
  container: {
    height: '100%',
    marginLeft: '.5%',
    flex: 1,
  },
  consoleText: {
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    fontSize: 30,
    paddingVertical: 5,
  },
  consoleInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  consoleContainer: {
    justifyContent: "flex-end",
  },
  historyContainer: {
  },
});