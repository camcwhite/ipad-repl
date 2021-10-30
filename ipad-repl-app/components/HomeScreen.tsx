import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import  {NativeStackNavigationProp} from "@react-navigation/native-stack";
import { StackParamList } from "../App";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<StackParamList,'Home'> 
};

export const HomeScreen = ( { navigation }:HomeScreenProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.menuButton}
        onPress={() => navigation.navigate('REPLScreen', { language: 'python3' })}
      >
        <Text style={styles.menuButtonText}>Python REPL</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.menuButton}
        onPress={() => console.log('Settings')}
      >
        <Text style={styles.menuButtonText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.menuButton}
        onPress={() => console.log('About')}
      >
        <Text style={styles.menuButtonText}>About</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#745C97',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    backgroundColor: '#39375B',
    width: '40%',
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  menuButtonText: {
    textAlign: 'center',
    fontSize: 56,
    color: '#F5B0CB',
  },
});