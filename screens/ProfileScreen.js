import { Button, Text, View } from "react-native";
import { auth } from "../firebase";

export default function ProfileScreen({ user }) { // <--- user als Prop
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Profil</Text>
      <Text style={{ marginTop: 20 }}>E-Mail: {user?.email ?? "Nicht eingeloggt"}</Text>
      <Button title="Logout" onPress={() => auth.signOut()} />
    </View>
  );
}