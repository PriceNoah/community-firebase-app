import * as ImagePicker from 'expo-image-picker';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { Button, FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db, storage } from "./firebase";
import SplashScreen from "./SplashScreen"; // Falls SplashScreen.js im Hauptverzeichnis liegt

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show splash screen for 2 seconds
  if (showSplash) return <SplashScreen />;

  // Community Feed Code
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, "feed"), orderBy("created", "desc"));
    const unsub = onSnapshot(q, snap => {
      setFeed(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleLogout = () => signOut(auth);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setPostImage(result.assets[0].uri);
  };

  const handlePost = async () => {
    let imageUrl = "";
    if (postImage) {
      const res = await fetch(postImage);
      const blob = await res.blob();
      const fileRef = ref(storage, `images/${Date.now()}_${user.uid}.jpg`);
      await uploadBytes(fileRef, blob);
      imageUrl = await getDownloadURL(fileRef);
    }
    await addDoc(collection(db, "feed"), {
      text: postText,
      image: imageUrl,
      user: user.email,
      created: new Date()
    });
    setPostText("");
    setPostImage(null);
  };

  if (!user) {
    return (
      <View style={{ flex:1, justifyContent: "center", padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 16 }}>{authState === "register" ? "Registrieren" : "Login"}</Text>
        <TextInput placeholder="E-Mail" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderBottomWidth: 1, marginBottom: 12, padding: 8 }} />
        <TextInput placeholder="Passwort" value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1, marginBottom: 12, padding: 8 }} />
        <Button title={authState === "register" ? "Registrieren" : "Login"} onPress={authState === "register" ? handleRegister : handleLogin} />
        <TouchableOpacity onPress={() => setAuthState(authState === "register" ? "login" : "register")}>
          <Text style={{ color: "blue", textAlign: "center", marginTop: 10 }}>
            {authState === "register" ? "Schon Mitglied? Login" : "Noch kein Konto? Jetzt registrieren"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, paddingTop: 40 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Community Feed</Text>
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <TextInput placeholder="Sag etwas..." value={postText} onChangeText={setPostText} style={{ flex: 1, borderWidth: 1, borderRadius: 5, padding: 8, marginRight: 5 }} />
        <Button title="Foto" onPress={pickImage} />
        <Button title="Posten" onPress={handlePost} />
      </View>
      {postImage ? <Image source={{ uri: postImage }} style={{ width: 100, height: 100, marginBottom: 10 }} /> : null}
      <FlatList
        data={feed}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
            <Text style={{ marginVertical: 5 }}>{item.text}</Text>
            {item.image ? <Image source={{ uri: item.image }} style={{ width: 200, height: 200 }} /> : null}
            <Text style={{ fontSize: 10, color: "gray" }}>{item.created?.toDate?.().toLocaleString?.() || ""}</Text>
          </View>
        )}
      />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}
