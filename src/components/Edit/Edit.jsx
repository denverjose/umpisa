import { useState, useEffect, useContext } from "react";
import useHttp from "../../hooks/use-http";
import { useNavigate } from "react-router-dom";
import { editProfile } from "../../lib/api";
import ProfileContext from "../../store/profile-context";
import classes from "./Edit.module.css";
import Card from "../UI/Card";

const Edit = (props) => {
  const [profile, setProfile] = useState(props.profile);
  const { sendRequest, status } = useHttp(editProfile);
  const navigate = useNavigate();
  const profileCtx = useContext(ProfileContext);

  const updateProfile = profileCtx.callBack;

  useEffect(() => {
    if (status === "completed") {
      navigate("/quotes");
      updateProfile();
    }
  }, [status, history, updateProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest({
      data: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
        email: profile.email,
        birthday: profile.birthday,
      },
      profileId: props.profileId,
    });
  };

  return (
    <Card className={classes.auth}>
      <form name="createForm" onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label>First Name:</label>
          <input
            type="text"
            label="firstName"
            value={profile.firstName}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
        </div>
        <div className={classes.control}>
          <label className="">Last Name:</label>
          <input
            type="text"
            label="lastName"
            value={profile.lastName}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
        </div>
        <div className={classes.control}>
          <label className="">Bio:</label>
          <input
            type="text"
            label="bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>
        <div className={classes.control}>
          <label className="">Email:</label>
          <input
            type="email"
            label="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div className={classes.control}>
          <label className="">Birthday:</label>
          <input
            type="date"
            label="phone"
            value={profile.birthday}
            min="1950-01-01"
            onChange={(e) =>
              setProfile({ ...profile, birthday: e.target.value })
            }
          />
        </div>
        <div className={classes["actions"]}>
          <button>Update</button>
        </div>
      </form>
    </Card>
  );
};

export default Edit;
