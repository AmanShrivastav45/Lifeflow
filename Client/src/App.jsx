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
import UserDashboard from "./pages/verified-donor/DonorDashboard.jsx";
import RecieverHome from "./pages/verified-reciever/RecieverHome.jsx";
import BloodBank from "./pages/verified-donor/BloodBank.jsx";
import Hospitals from "./pages/verified-donor/Hospitals.jsx";
import Laboratories from "./pages/verified-donor/Laboratories.jsx";
import HealthCareSignup from "./pages/authentication/HealthCareSignup.jsx";
import HospitalHome from "./pages/verified-hospital/HospitalHome.jsx";
import LabHome from "./pages/verified-lab/LabHome.jsx";

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
    } else if (role === "Hospital" || role === "hospital") {
      return <Navigate to={`/hospital/${user._id}`} replace />;
    } else if (role === "Laboratory" || role === "laboratory") {
      return <Navigate to={`/lab/${user._id}`} replace />;
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
          path="/donor/:donorId/bloodbank"
          element={
            <ProtectedRoute>
              <BloodBank />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:recieverId"
          element={
            <ProtectedRoute>
              <RecieverHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/:hospitalId"
          element={
            <ProtectedRoute>
              <HospitalHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab/:labId"
          element={
            <ProtectedRoute>
              <LabHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:recieverId/bloodbank"
          element={
            <ProtectedRoute>
              <BloodBank />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:recieverId/hospitals"
          element={
            <ProtectedRoute>
              <Hospitals />
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
          path="/healthcare-signup"
          element={
            // <RedirectAuthenticatedUser>
              <HealthCareSignup />
            // </RedirectAuthenticatedUser>
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
        position="top-center"
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
