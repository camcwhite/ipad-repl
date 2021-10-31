import React, { useState } from "react";
import { StyleSheet, Switch, TextInput} from "react-native";

export const SettingsScreen = (props) => {
  const [s, setS] = useState("Monokai");

  console.log(s)
  return (
    <Switch
      style={{
        width: '50%',
        backgroundColor: '#0ff',
      }}
      value={s === "Monokai"}
      onValueChange={(value) => setS((value) ? 'Monokai' : 'Solarized Light')}
    />
  );
};

const styles = StyleSheet.create({
});