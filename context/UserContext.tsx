"use client";
import { ReactNode, createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

export interface UserType {
  name: string;
  email: string;
}

const UserContext = createContext<any>(undefined);

function UserInfoProvider({ children }: { children: ReactNode }) {
  const userDetails = Cookies.get("user-details")
    ? JSON.parse(Cookies.get("user-details")!)
    : null;

  const [userInfo, setUserInfo] = useState<UserType | null>(userDetails);

  function logout() {
    Cookies.remove("token");
    Cookies.remove("user-details");
    setUserInfo(null);
  }

  function updateProfile(email: string) {
    console.log(email);
    const updatedUserDetails = { ...userDetails, email };
    console.log(updatedUserDetails);
    Cookies.set("user-details", JSON.stringify(updatedUserDetails));
    setUserInfo(updatedUserDetails);
  }

  console.log(userDetails);
  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, logout, updateProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserInfoProvider };
