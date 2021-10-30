import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, NativeEventEmitter } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../App";

export type REPLScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'REPLScreen'>

const PREFIX = '>>> ';

export const REPLScreen = (navigation: REPLScreenNavigationProp) => {
  const [consoleHistory, setConsoleHistory] = useState([]);
  const [consoleEditText, setConsoleEditText] = useState("");
  const consoleInput = useRef(undefined);

  return (
    <View style={styles.container}>
      {consoleHistory.map((text) => {
        return (
          <Text style={styles.consoleText}>{text}</Text>
        );
      })}
      <View style={styles.consoleInputContainer}>
        <Text style={styles.consoleText}>{PREFIX}</Text>
        <TextInput
          style={{...styles.consoleText, paddingVertical: 0 }}
          autoCorrect={false}
          autoCapitalize="none"
          multiline={true}
          numberOfLines={4}
          autoFocus={true}
          value={consoleEditText}
          onChangeText={(newText) => {
            if (newText.slice(-1) !== '\n')
              setConsoleEditText(newText);
          }}
          onKeyPress={(event) => {
            if (event.nativeEvent.key === 'Enter') {
              setConsoleHistory([...consoleHistory, PREFIX + consoleEditText]);
              setConsoleEditText("");
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
    alignItems: 'center',
  }
});