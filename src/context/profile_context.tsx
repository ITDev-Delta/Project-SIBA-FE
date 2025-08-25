import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { getServiceProfile } from "../api/Profile/services/profileService";
import type { IProfile } from "../api/Profile/types/profile.interface";

interface ProfileContextType {
  isLoading: boolean;
  getProfile: () => void;
  logoutProfile: () => void;
  profile: IProfile | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within an ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<IProfile | null>(null);

  const getProfile = (): void => {
    setIsLoading(true);

    const promise = getServiceProfile();
    promise.then((res) => {
      if (res.status === 200 || res.status === 201) {
        setIsLoading(false);
        setProfile(res.data.data);
      }
      // else {
      // toast.error(
      //   res.data.message || "Gagal load profile, silahkan coba lagi."
      // );
      // }
    });
  };

  const logoutProfile = (): void => {
    setProfile(null);
  };

  return (
    <ProfileContext.Provider
      value={{ isLoading, getProfile, profile, logoutProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
