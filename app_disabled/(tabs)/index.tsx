// ...Imports wie gehabt, aber OHNE firebase/auth!
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, Image, Text, TextInput, View } from "react-native";
import { db, storage } from "../../firebase";
import SplashScreen from "../../SplashScreen";

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [postText, setPostText] = useState<string>("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [feed, setFeed] = useState<any[]>([]);

  // Dummy-User anlegen!
  const user = { email: "testuser@expogo.com", uid: "dummy-id" };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Feed laden
    const q = query(collection(db, "feed"), orderBy("created", "desc"));
    const unsub = onSnapshot(q, snap => {
      setFeed(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

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
      created: serverTimestamp()
    });
    setPostText("");
    setPostImage(null);
  };

  if (showSplash) return <SplashScreen />;

  // Kein Auth-UI, direkt Feed:
  return (
    <View style={{ flex: 1, padding: 10, paddingTop: 40 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Community Feed (Demo)</Text>
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
            <Text style={{ fontSize: 10, color: "gray" }}>
              {item.created?.toDate?.() ? item.created.toDate().toLocaleString() : ""}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
