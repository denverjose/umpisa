import { useEffect } from "react";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { getProfile } from "../lib/api";
import Edit from "../components/Edit/Edit";

const EditProfile = ({ profileId }) => {
  const {
    sendRequest,
    status,
    data: loadedProfile,
    error,
  } = useHttp(getProfile, true);

  useEffect(() => {
    sendRequest(profileId);
  }, [sendRequest, profileId]);

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="centered">{error}</p>;
  }

  return <Edit profile={loadedProfile} profileId={profileId} />;
};

export default EditProfile;
