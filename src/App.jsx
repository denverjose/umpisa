import { useContext } from "react";
import Layout from "./components/Layout/Layout";
import AuthContext from "./store/auth-context";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Feed from '../src/pages/Feed'
import Profile from '../src/pages/Profile'
import EditProfile from '../src/pages/EditProfile'
import PostDetail from '../src/pages/PostDetail'

function App() {
  const authCtx = useContext(AuthContext);
  const profileId = authCtx.token
  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <Layout>
      <Routes>
        {!isLoggedIn && <Route path="/" element={<HomePage />} />}
        {isLoggedIn && (
          <>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:profileId" element={<Profile />} />
            <Route
              path="/edit-profile"
              element={<EditProfile profileId={profileId} />}
            />
            <Route path="/post/:userId" element={<PostDetail />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
