import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Keyboard, TextInput, Text, Platform, SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { StackParamList } from "../App";
import { getResponse, REPLTextResponse } from "../models/pythonREPL";
import { Colors } from "../assets/colors";
import { API_URL } from "../env";

export type REPLScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'REPLScreen'>

const START_PREFIX = '>>> ';
const CONTINUED_PREFIX = '... ';
const CLEAR_CONSOLE_KEY = '˚';
const UP_ARROW_KEY = '…';
const DOWN_ARROW_KEY = '≥';
const SPECIAL_CHARS = new Set([CLEAR_CONSOLE_KEY, UP_ARROW_KEY, DOWN_ARROW_KEY]);
const getPrefix = (index: number) => (index === 0) ? START_PREFIX : CONTINUED_PREFIX;

export const REPLScreen = (navigation: REPLScreenNavigationProp) => {
  const [consoleHistory, setConsoleHistory] = useState(new Array<string>());
  const [consoleEditText, setConsoleEditText] = useState([""]);
  const [consoleHistoryDisplay, setConsoleHistoryDisplay] = useState(new Array<string>());
  const [consoleEditNewLines, setConsoleEditNewLines] = useState(0);
  const [consoleHistoryIndex, setConsoleHistoryIndex] = useState(-1);
  const [consoleEditTextCache, setConsoleEditTextCache] = useState("");
  const consoleHistoryScrollView = useRef<ScrollView>(null);

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

  const assertFail = (): never => { throw Error(); }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={useHeaderHeight() + 20}
      style={styles.outerContainer}
    >
      <SafeAreaView style={styles.container} onTouchStart={Keyboard.dismiss}>
        <View style={styles.consoleContainer}>
          <ScrollView
            style={styles.historyContainer}
            ref={consoleHistoryScrollView}
            onContentSizeChange={() => (consoleHistoryScrollView.current) ? consoleHistoryScrollView.current.scrollToEnd({ animated: true }) : {}}
          >
            {consoleHistoryDisplay.map((text: string, index: number) => {
              return (
                <Text key={index} style={styles.consoleText}>{text}</Text>
              );
            })}
          </ScrollView>
          <View style={styles.consoleInputContainer}>
            <Text style={styles.consoleText}>
              {getPrefix(consoleEditText.length - 1)}
            </Text>
            <TextInput
              style={{ ...styles.consoleText, width: '100%' }}
              autoCorrect={false}
              autoCapitalize="none"
              multiline={true}
              numberOfLines={1}
              scrollEnabled={true}
              autoFocus={true}
              value={consoleEditText.slice(-1)[0]}
              selectionColor={Colors.primary}
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
                if (event.nativeEvent.key === 'Enter') {
                  getResponse(consoleEditText, (response) => {
                    if (response.responseComplete()) {
                      const responseText = response.responseText();
                      const prefix = getPrefix(consoleEditText.length - 1);
                      setConsoleHistory([
                        ...consoleHistory,
                        ...consoleEditText,
                      ]);
                      setConsoleHistoryDisplay([
                        ...consoleHistoryDisplay,
                        prefix + consoleEditText.slice(-1)[0],
                        responseText
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
  outerContainer: {
    backgroundColor: Colors.backgroundPrimary,
    flex: 1,
  },
  container: {
    height: '100%',
    marginLeft: '.5%',
    flex: 1,
  },
  consoleText: {
    color: Colors.fontPrimary,
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