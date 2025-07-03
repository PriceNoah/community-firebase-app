import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { registerUser } from "../services/authService";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(email, password, displayName, bio, city, state);
      navigation.replace("Home");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="E-Mail" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Passwort" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Name" value={displayName} onChangeText={setDisplayName} />
      <TextInput placeholder="Biografie" value={bio} onChangeText={setBio} />
      <TextInput placeholder="Stadt" value={city} onChangeText={setCity} />
      <TextInput placeholder="Bundesland" value={state} onChangeText={setState} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Registrieren" onPress={handleRegister} />
    </View>
  );
}
