import React, { useEffect, useContext, useCallback } from "react";
import AuthContext from "./auth-context";
import { getProfile } from "../lib/api";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const ProfileContext = React.createContext({
  fullName: "",
  profilePicture: "",
  callBack: () => {}
});

export const ProfileContextProvider = (props) => {
  const authCtx = useContext(AuthContext);
  const profileId = authCtx.token;

  const {
    sendRequest,
    status,
    data: loadedProfile,
    error,
  } = useHttp(getProfile, true);

  useEffect(() => {
    sendRequest(profileId);
  }, [sendRequest, profileId]);

  const updateProfile = useCallback(() => {
    sendRequest(profileId);
  }, [sendRequest, profileId]);

  if (status === "pending") {
    return <div className="centered"><LoadingSpinner/></div>
  }

  if (error) {
    return <p className="centered">{error}</p>;
  }

  const contextValue = {
    fullName: `${loadedProfile?.firstName} ${loadedProfile?.lastName}`,
    profilePicture: loadedProfile?.profilePicture,
    callBack: updateProfile,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
