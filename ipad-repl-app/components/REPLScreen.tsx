import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, NativeEventEmitter } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

  return (
    <View style={styles.container}>
      {consoleHistoryDisplay.map((text) => {
        return (
          <Text style={styles.consoleText}>{text}</Text>
        );
      })}
      <View style={styles.consoleInputContainer}>
        <View style={styles.prefixContainer}>
          <Text style={styles.consoleText}>
            {getPrefix(consoleEditText.length - 1)}
          </Text>
        </View>
        <TextInput
          style={{...styles.consoleText}}
          autoCorrect={false}
          autoCapitalize="none"
          multiline={true}
          numberOfLines={1}
          autoFocus={true}
          value={consoleEditText.slice(-1)[0]}
          onContentSizeChange={(event) => {
            // console.log(event.nativeEvent.contentSize.height);
          }}
          onChangeText={(newText) => {
            console.log(newText);
            if (newText.slice(-1) !== '\n')
              setConsoleEditText([...consoleEditText.slice(0, -1), newText]);
          }}
          onKeyPress={(event) => {
            console.log(`Key: ${event.nativeEvent.key}`);
            if (event.nativeEvent.key === 'Enter') {
              const response = getResponse(consoleEditText);
              if (response.responseComplete()) {
                console.log('COMPLETE ' + consoleEditText);
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
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginLeft: '.5%',
  },
  consoleText: {
    fontFamily: 'Courier New',
    textAlignVertical: 'center',
    fontSize: 30,
    paddingVertical: 5,
  },
  consoleInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  prefixContainer: {
    backgroundColor: '#DDD',
    display: 'flex',
    flexDirection: 'column',
  },
});