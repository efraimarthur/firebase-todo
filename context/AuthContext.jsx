import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user);
  const [displayName, setDisplayName] = useState("");
  // console.log(displayName);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log(user.displayName);
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: "",
        });
        if (displayName) {
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: displayName,
          });
          // console.log(displayName);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [displayName]);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  const getDisplayName = (name) => {
    setDisplayName(name);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, getDisplayName }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
