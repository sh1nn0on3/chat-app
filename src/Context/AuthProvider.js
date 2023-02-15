import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscibed = auth.onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        // console.log(user);
        setIsLoading(false);
        navigate("/");
        return;
      }
      setUser({});
      setIsLoading(false);
      navigate("/login");
    });
    // clean function
    return () => {
      unsubscibed();
    };
  }, [navigate]);
  return (
    <div>
      <AuthContext.Provider value={{ user }}>
        {isLoading ? <Spin /> : children}
      </AuthContext.Provider>
    </div>
  );
}
