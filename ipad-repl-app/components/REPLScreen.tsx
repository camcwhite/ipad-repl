import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Keyboard, TextInput, Text, Platform, SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { StackParamList } from "../App";
import { getResponse } from "../models/pythonREPL";

export type REPLScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'REPLScreen'>

const START_PREFIX = '>>> ';
const CONTINUED_PREFIX = '... ';
const getPrefix = (index) => (index === 0) ? START_PREFIX : CONTINUED_PREFIX;

export const REPLScreen = (navigation: REPLScreenNavigationProp) => {
  const [consoleHistory, setConsoleHistory] = useState([]);
  const [consoleEditText, setConsoleEditText] = useState([""]);
  const [consoleHistoryDisplay, setConsoleHistoryDisplay] = useState([]);
  const [consoleEditNewLines, setConsoleEditNewLines] = useState(0);
  const consoleInput = useRef(undefined);

  const clearConsole = () => {
    setConsoleHistoryDisplay([]);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={useHeaderHeight() + 20}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container} onTouchStart={Keyboard.dismiss}>
        <View style={styles.consoleContainer}>
          <View style={styles.historyContainer}>
            {consoleHistoryDisplay.map((text) => {
              return (
                <Text style={styles.consoleText}>{text}</Text>
              );
            })}
          </View>
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
              autoFocus={true}
              value={consoleEditText.slice(-1)[0]}
              onChangeText={(newText) => {
                if (newText.slice(-1) === '\t')
                  newText = newText.slice(0, -1) + '    ';
                if (newText.slice(-1) === '˚')
                  clearConsole();
                else if (newText.slice(-1) !== '\n')
                  setConsoleEditText([...consoleEditText.slice(0, -1), newText]);
              }}
              onKeyPress={(event) => {
                console.log('Key ' + event.nativeEvent.key)
                if (event.nativeEvent.key === 'Enter') {
                  const response = getResponse(consoleEditText);
                  if (response.responseComplete()) {
                    const responseText = response.responseText();
                    const prefix = getPrefix(consoleEditText.length - 1);
                    setConsoleHistory([
                      ...consoleHistory,
                      ...consoleEditText,
                      responseText
                    ]);
                    setConsoleHistoryDisplay([
                      ...consoleHistoryDisplay,
                      prefix + consoleEditText.slice(-1)[0],
                      responseText
                    ]);
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
  container: {
    height: '100%',
    marginLeft: '.5%',
    flex: 1,
  },
  consoleText: {
    fontFamily: 'Courier New',
    textAlignVertical: 'center',
    fontSize: 30,
    paddingVertical: 5,
  },
  consoleInputContainer: {
    backgroundColor: '#DDD',
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