import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { StyleSheet, Switch, TextInput} from "react-native";
import { getTheme, useTheme } from "../themes";

export const SettingsScreen = (props) => {
  const [s, setS] = useState("Monokai");
  // const {activeTheme, setActiveTheme} = useTheme();

  const setActiveTheme = async (newTheme:string):Promise<void> => {
    try {
      await AsyncStorage.setItem('@active_theme', JSON.stringify(getTheme(newTheme)))
    }
    catch (e) {
      console.log(e);
    }
  };

  console.log(s)
  return (
    <Switch
      style={{
        width: '50%',
        backgroundColor: '#0ff',
      }}
      value={s === "Monokai"}
      onValueChange={(value) => {
        setS((value) ? 'Monokai' : 'Solarized Light');
        setActiveTheme((value) ? 'Monokai' : 'Solarized Light');
      }}
    />
  );
};

const styles = StyleSheet.create({
});