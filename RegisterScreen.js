await createUserProfile(user.uid, { name, email });
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from "../utils/createUserProfile";
import { app } from "../firebaseConfig";

// ... in deiner Komponente, z. B. handleRegister Funktion:
const handleRegister = async (email, password, name) => {
  const auth = getAuth(app);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // Nach erfolgreicher Registrierung Profil anlegen:
  await createUserProfile(user.uid, { name, email });
};
