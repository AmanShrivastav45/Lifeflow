import { useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/authentication/Login.jsx";
import Signup from "./pages/authentication/Signup.jsx";
import Verification from "./pages/authentication/Verification.jsx";
import ResetPassword from "./pages/authentication/ResetPassword.jsx";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage.jsx";
import Loader from "./components/Loader";
import { useAuthStore } from "./store/auth.js";
import Home from "./pages/Home.jsx";
import UserDashboard from "./pages/verified-user/DonorDashboard.jsx";
import MentorDashboard from "./pages/verified-mentor/MentorDashboard.jsx";
import Learn from "./components/user/Learn.jsx";
import Practice from "./components/user/Practice.jsx";
import Roadmaps from "./components/user/Roadmaps.jsx";
import IDE from "./components/user/IDE.jsx";
import Alumni from "./components/user/Alumni.jsx";
import Openings from "./components/user/Openings.jsx";
import Coderoom from "./components/user/Coderoom.jsx";
import Overview from "./components/mentor/Overview.jsx";
import MentorHome from "./pages/verified-mentor/RecieverHome.jsx";
import ClassDashboard from "./pages/verified-user/ClassDashboard.jsx";
import TestPage from "./pages/verified-user/TestPage.jsx";
import Details from "./pages/authentication/Details.jsx";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user.isVerified) return <Navigate to="/verify-email" replace />;
  if (user.role !== requiredRole) return <Navigate to="/login" replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, role } = useAuthStore();
  if (isAuthenticated && user.isVerified && role) {
    if (role === "donor") {
      return <Navigate to={`/donor/${user._id}`} replace />;
    } else if (role === "reciever") {
      return <Navigate to={`/user/${user._id}`} replace />;
    } else {
      <Navigate to="/" replace />;
    }
  }
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <Loader />;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <RedirectAuthenticatedUser>
              <Home />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/donor/:donorId"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:recieverId"
          element={
            <ProtectedRoute>
              <MentorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<Verification />} />
        <Route path="/user/:userId/:classId/test/:testId" element={<TestPage />} />

        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          style: {
            zIndex: 20000,
            borderRadius: "5px",
          },
        }}
      />
    </>
  );
}

export default App;
