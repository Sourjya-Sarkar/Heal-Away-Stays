import React, { useEffect, useState, useCallback } from "react";

import axios from "axios";
const UserContext = React.createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/profile");
      setUser(data);
      setReady(true);
    } catch {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
