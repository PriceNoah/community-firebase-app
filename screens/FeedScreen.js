import * as ImagePicker from "expo-image-picker";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { Button, FlatList, Image, Text, TextInput, View } from "react-native";
import { db, storage } from "../firebase"; // <--- KEIN auth import nötig

export default function FeedScreen({ user }) { // <--- user als Prop
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [feed, setFeed] = useState([]);

  // Debug-Ausgaben
  console.log("User:", user);
  console.log("Feed:", feed);

  useEffect(() => {
    const q = query(collection(db, "feed"), orderBy("created", "desc"));
    const unsub = onSnapshot(q, snap => {
      setFeed(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const pickImage = async () => {
    console.log("pickImage gestartet");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setPostImage(result.assets[0].uri);
  };

  const handlePost = async () => {
    console.log("handlePost gestartet");
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
      user: user?.email || "Anonym",
      created: serverTimestamp()
    });
    setPostText("");
    setPostImage(null);
  };

  // User-Prüfung: Nicht eingeloggt?
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Bitte einloggen!</Text>
      </View>
    );
  }

  // Normale UI:
  return (
    <View style={{ flex: 1, padding: 10, paddingTop: 40, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 20, marginBottom: 10, color: "#111" }}>Community Feed</Text>
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        <TextInput
          placeholder="Sag etwas..."
          value={postText}
          onChangeText={setPostText}
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 5,
            padding: 8,
            marginRight: 5,
            color: "#111",
            backgroundColor: "#fff",
            borderColor: "#111"
          }}
          placeholderTextColor="#888"
        />
        <Button title="Foto" onPress={pickImage} color="#007AFF" />
        <Button title="Posten" onPress={handlePost} color="#007AFF" />
      </View>
      {postImage ? <Image source={{ uri: postImage }} style={{ width: 100, height: 100, marginBottom: 10 }} /> : null}
      {feed.length === 0 && (
        <Text style={{ color: "#222", textAlign: "center", marginTop: 30 }}>
          Noch keine Posts vorhanden.
        </Text>
      )}
      <FlatList
        data={feed}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: "#fafafa" }}>
            <Text style={{ fontWeight: "bold", color: "#222" }}>{item.user}</Text>
            <Text style={{ marginVertical: 5, color: "#222" }}>{item.text}</Text>
            {item.image ? <Image source={{ uri: item.image }} style={{ width: 200, height: 200 }} /> : null}
            <Text style={{ fontSize: 10, color: "gray" }}>
              {item.created?.toDate?.() ? item.created.toDate().toLocaleString() : ""}
            </Text>
          </View>
        )}
      />
    </View>
  );
}