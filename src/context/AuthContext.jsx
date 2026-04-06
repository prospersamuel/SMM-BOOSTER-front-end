// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Loader } from "lucide-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 SIGN UP
  const signup = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      userId: res.user.uid,
      email: res.user.email,
      balance: 0,
      createdAt: Timestamp.now(),
      emailVerified: res.user.emailVerified
    });

    return res;
  };

  // 🔹 LOGIN
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🔹 GOOGLE LOGIN
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    const ref = doc(db, "users", res.user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        userId: res.user.uid,
        email: res.user.email,
        balance: 0,
        createdAt: Date.now(),
      });
    }

    return res;
  };

  const sendVerification = async (user) => sendEmailVerification(user);
  const logout = () => signOut(auth);

  // 🔹 KEEP USER LOGGED IN
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // keep user even if email not verified
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-emerald-600 rounded-full h-12 w-12" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, signup, login, googleLogin, logout, sendVerification }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);