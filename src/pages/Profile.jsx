import React, { useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AuthContext from "../store/auth-context";
import useHttp from "../hooks/use-http";
import { getProfile } from "../lib/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Posts from "../components/ProfilePosts/Posts";
import classes from "./Profile.module.css";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const { profileId } = useParams();

  const { sendRequest, status, data: loadedProfile, error } = useHttp(getProfile, true);

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

  const birthday = loadedProfile.birthday ? (
    <p className={classes.birthday}>
      <CakeOutlinedIcon fontSize="40" />
      {new Date(loadedProfile.birthday).toLocaleDateString("en-En", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  ) : null;

  return (
    <div className={classes.profilepage}>
      <div className={classes.profile}>
        <Avatar
          alt={loadedProfile.firstName}
          src={loadedProfile.profilePicture}
          sx={{ width: 180, height: 180 }}
        />
        <div className={classes.info}>
          <p className={classes.name}>
            {`${loadedProfile.firstName} ${loadedProfile.lastName}`}
          </p>
          <p className={classes.bio}>{loadedProfile.bio}</p>
          {birthday}
          {token === profileId && (
            <Link className={classes.edit} to="/edit-profile">
              <SettingsOutlinedIcon fontSize="40" />
              Edit Profile
            </Link>
          )}
        </div>
      </div>
      <Posts profileId={profileId} />
    </div>
  );
};

export default Profile;
