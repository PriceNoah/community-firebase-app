import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export async function registerUser(email, password, displayName, bio, city, state) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    displayName,
    email,
    bio,
    city,
    state,
    photoURL: "",
    linkedIn: "",
    instagram: "",
    customLink: "",
    isAdmin: false,
    createdAt: new Date().toISOString()
  });

  return user;
}

export async function loginUser(email, password) {
  // Meldet den User mit E-Mail und Passwort an
  return await signInWithEmailAndPassword(auth, email, password);
}
