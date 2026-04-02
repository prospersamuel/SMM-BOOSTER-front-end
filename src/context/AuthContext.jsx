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

    // 🔥 CREATE FIRESTORE USER DOC (ONCE)
    await setDoc(doc(db, "users", res.user.uid), {
      userId: res.user.uid,
      email: res.user.email,
      balance: 0,
      createdAt: Timestamp.now(),
      emailVerified: false
    });
    return res;
  };

  const sendVerification = async (user) => {
  return sendEmailVerification(user);
};

  // 🔹 LOGIN
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🔹 GOOGLE LOGIN
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    // 👇 Only create Firestore doc if it doesn't exist
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

  const logout = () => signOut(auth);

  // 🔹 KEEP USER LOGGED IN
useEffect(() => {
  const unsub = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser && !currentUser.emailVerified) {
      setUser(null);
    } else {
      setUser(currentUser);
    }
    setLoading(false);
  });
  return unsub;
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-emerald-600 rounded-full h-12 w-12"/>
      </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, signup, login, googleLogin, logout, sendVerification }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);