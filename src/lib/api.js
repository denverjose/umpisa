import bcrypt from "bcryptjs";

const FIREBASE_DOMAIN =
  "https://umpisa-bf4f3-default-rtdb.asia-southeast1.firebasedatabase.app/";

function formatDate(timestamp) {
  const date = new Date(timestamp);

  // Format hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight case
  const formattedTime = `${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${ampm}`;

  // Format month, day, and year
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Combine all parts into the desired format
  const formattedDate = `${formattedTime} · ${month} ${day}, ${year}`;

  return formattedDate;
}

// Example usage:

async function fetchData(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function addUser(userData) {
  const hashedPassword = await hashPassword(userData.password);
  const userWithHashedPassword = { ...userData, password: hashedPassword };

  return await fetchData(`${FIREBASE_DOMAIN}/users.json`, {
    method: "POST",
    body: JSON.stringify(userWithHashedPassword),
    headers: { "Content-Type": "application/json" },
  });
}

export async function authLogin(requestData) {
  const usersData = await fetchData(`${FIREBASE_DOMAIN}/users.json`);
  if (!usersData) {
    throw new Error("No App Users");
  }
  const users = Object.keys(usersData).map((key) => ({
    id: key,
    ...usersData[key],
  }));

  const user = users.find((user) => user.email === requestData.email);
  if (!user) {
    throw new Error("No User Found");
  }

  const isPasswordValid = await bcrypt.compare(
    requestData.password,
    user.password
  );
  if (isPasswordValid) {
    const expirationTime = new Date(new Date().getTime() + 3600000 * 2);
    requestData.method(user.id, expirationTime.toISOString());
    return user; // Return user data as needed
  } else {
    throw new Error("Invalid Password");
  }
}

export async function getProfile(profileId) {
  return await fetchData(`${FIREBASE_DOMAIN}/users/${profileId}.json`);
}

export async function editProfile(requestData) {
  return await fetchData(
    `${FIREBASE_DOMAIN}/users/${requestData.profileId}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(requestData.data),
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function addPost(requestData) {
  const timestamp = formatDate(new Date().toISOString());
  const postDataWithTimestamp = {
    ...requestData.postData,
    datePosted: timestamp,
  };
  const data = await fetchData(
    `${FIREBASE_DOMAIN}/posts/${requestData.profileId}.json`,
    {
      method: "POST",
      body: JSON.stringify(postDataWithTimestamp),
      headers: { "Content-Type": "application/json" },
    }
  );
  return { postId: data.name };
}

export async function getProfilePost(profileId) {
  const [postsData, profileData] = await Promise.all([
    fetchData(`${FIREBASE_DOMAIN}/posts/${profileId}.json`),
    fetchData(`${FIREBASE_DOMAIN}/users/${profileId}.json`),
  ]);

  const transformedPosts = Object.keys(postsData).map((key) => ({
    id: key,
    fullName: `${profileData.firstName} ${profileData.lastName}`,
    profilePicture: profileData.profilePicture,
    ...postsData[key],
  }));

  return transformedPosts.flat().reverse();
}

export async function getAllPosts() {
  const postsData = await fetchData(`${FIREBASE_DOMAIN}/posts.json`);
  if (!postsData) {
    throw new Error("No posts were added yet!");
  }
  const transformedPosts = await Promise.all(
    Object.keys(postsData).map(async (key) => {
      const [postData, profileData] = await Promise.all([
        fetchData(`${FIREBASE_DOMAIN}/posts/${key}.json`),
        fetchData(`${FIREBASE_DOMAIN}/users/${key}.json`),
      ]);

      return Object.keys(postData).map((postId) => ({
        id: postId,
        fullName: `${profileData.firstName} ${profileData.lastName}`,
        profilePicture: profileData.profilePicture,
        ...postData[postId],
      }));
    })
  );

  return transformedPosts.flat().reverse();
}

export async function getPostComment(postId) {
  const commentsData = await fetchData(
    `${FIREBASE_DOMAIN}/comments/${postId}.json`
  );

  const transformedComments = await Promise.all(
    Object.keys(commentsData).map(async (key) => {
      const profileData = await fetchData(
        `${FIREBASE_DOMAIN}/users/${commentsData[key].userId}.json`
      );

      return {
        id: key,
        fullName: `${profileData.firstName} ${profileData.lastName}`,
        profilePicture: profileData.profilePicture,
        ...commentsData[key],
      };
    })
  );

  return transformedComments;
}

export async function addComment(requestData) {
  const data = await fetchData(
    `${FIREBASE_DOMAIN}/comments/${requestData.postId}.json`,
    {
      method: "POST",
      body: JSON.stringify(requestData.commentData),
      headers: { "Content-Type": "application/json" },
    }
  );
  return { commentId: data.name };
}

export async function getPostLike(postId) {
  const likesData = await fetchData(`${FIREBASE_DOMAIN}/likes/${postId}.json`);

  const transformedLikes = await Promise.all(
    Object.keys(likesData).map(async (key) => {
      const profileData = await fetchData(
        `${FIREBASE_DOMAIN}/users/${likesData[key].userId}.json`
      );

      return {
        id: key,
        fullName: `${profileData.firstName} ${profileData.lastName}`,
        profilePicture: profileData.profilePicture,
        ...likesData[key],
      };
    })
  );

  return transformedLikes;
}

export async function like(requestData) {
  const data = await fetchData(
    `${FIREBASE_DOMAIN}/likes/${requestData.postId}.json`,
    {
      method: "POST",
      body: JSON.stringify(requestData.likeData),
      headers: { "Content-Type": "application/json" },
    }
  );
  return { likeId: data.name };
}

export async function unlike(requestData) {
  await fetchData(
    `${FIREBASE_DOMAIN}/likes/${requestData.postId}/${requestData.likeId}.json`,
    {
      method: "DELETE",
    }
  );
  return null;
}

export async function getSinglePost(requestData) {
  const [postData, profileData] = await Promise.all([
    fetchData(
      `${FIREBASE_DOMAIN}/posts/${requestData.userId}/${requestData.postId}.json`
    ),
    fetchData(`${FIREBASE_DOMAIN}/users/${requestData.userId}.json`),
  ]);

  return {
    id: requestData.postId,
    fullName: `${profileData.firstName} ${profileData.lastName}`,
    profilePicture: profileData.profilePicture,
    ...postData,
  };
}
