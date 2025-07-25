import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

/**
 * Registriert einen neuen User und legt ein Firestore-Dokument an.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @param {string} bio
 * @param {string} city
 * @param {string} state
 * @returns {object} user | { error }
 */
export async function registerUser(email, password, displayName, bio, city, state) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore-Dokument für den User anlegen
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
      createdAt: serverTimestamp(), // besser als new Date().toISOString()
    });

    return user;
  } catch (error) {
    // Fehlerbehandlung: Gib das Error-Objekt zurück, damit der Screen darauf reagieren kann
    return { error };
  }
}

/**
 * Loggt einen User mit E-Mail und Passwort ein.
 * @param {string} email
 * @param {string} password
 * @returns {object} user | { error }
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    return { error };
  }
}
