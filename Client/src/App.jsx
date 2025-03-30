import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/common/Landing";
import HealthCareSignup from "./pages/authentication/HealthCareSignup";
import Signup from "./pages/authentication/Signup";
import Login from "./pages/authentication/Login";
import Verification from "./pages/authentication/Verification";
import AddDonation from "./pages/modals/AddDonation";
import { CONSTANTS } from "../../constants.js";

// Home Pages
import Laboratory from "./pages/home/Laboratory";
import Hopsital from "./pages/home/Hopsital";
import Receiver from "./pages/home/Receiver";
import Donor from "./pages/home/Donor";
import Loader from "./pages/components/Loader";
import { useAuthStore } from "./store/auth";
import Hospitals from "./pages/users/receiver/Hospitals.jsx";
import DonorProfile from "./profile/DonorProfile.jsx";
import ReceiverProfile from "./profile/ReceiverProfile.jsx";
import HospitalProfile from "./profile/HospitalProfile.jsx";
import LaboratoryProfile from "./profile/LaboratoryProfile.jsx";
import About from "./pages/common/About.jsx";
import ResetPassword from "./pages/authentication/ResetPassword.jsx";
import SetNewPassword from "./pages/authentication/SetNewPassword.jsx";

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
    if (role === CONSTANTS.ROLES.DONOR) {
      return <Navigate to={`/donor/${user._id}`} replace />;
    } else if (role === CONSTANTS.ROLES.RECEIVER) {
      return <Navigate to={`/receiver/${user._id}`} replace />;
    } else if (role === CONSTANTS.ROLES.HOSPITAL) {
      return <Navigate to={`/hospital/${user._id}`} replace />;
    } else if (role === CONSTANTS.ROLES.LABORATORY) {
      return <Navigate to={`/laboratory/${user._id}`} replace />;
    } else {
      <Navigate to="/" replace />;
    }
  }
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    console.log(
      `%c${"LIFEFLOW 1.0"}`,
      "font-size:72px; color: #00ccff; font-weight: bold; "
    );
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <Loader />;

  return (
    <>
      <div className="bg-gradient-to-b Inter from-white to-[#FAECCA] w-full fixed h-screen min-h-screen flex items-center justify-center">
        <Routes>
          {/* Landing */}
          <Route path="/" element={
              <RedirectAuthenticatedUser>
                <Landing />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/about" element={<About/>}/>
          {/* ---------------- Authentication Pages ---------------- */}
            <Route path="/login" element={
                <RedirectAuthenticatedUser>
                  <Login />
                </RedirectAuthenticatedUser>
              }
            />
            <Route path="/signup" element={
                <RedirectAuthenticatedUser>
                  <Signup />
                </RedirectAuthenticatedUser>
              }
            />
            <Route path="/healthcare-signup" element={
                <RedirectAuthenticatedUser>
                  <HealthCareSignup />
                </RedirectAuthenticatedUser>
              }
            />
            <Route path="/verify-email" element={<Verification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:role/:token" element={<SetNewPassword />} />

          {/* ---------------- Authentication Pages Ends ---------------- */}

          {/* ---------------- Home Pages ---------------- */}
            
            <Route path="/receiver/:userId" element={
                <ProtectedRoute>
                  <Receiver />
                </ProtectedRoute>
              }
            />
            <Route path="/donor/:userId" element={
                <ProtectedRoute>
                  <Donor />
                </ProtectedRoute>
              }
            />
            <Route path="/laboratory/:userId" element={
                <ProtectedRoute>
                  <Laboratory />
                </ProtectedRoute>
              }
            />
            <Route path="/hospital/:userId" element={
              <ProtectedRoute>
                <Hopsital />
              </ProtectedRoute>
            }
            />
            
          {/* ---------------- Home Pages Ends ---------------- */}
          
          {/* ---------------- Profile Pages ---------------- */}

          <Route path="/receiver/:userId/profile" element={
              <ProtectedRoute>
                  <ReceiverProfile />
              </ProtectedRoute>
          } />
          <Route path="/donor/:userId/profile" element={
              <ProtectedRoute>
                <DonorProfile />
              </ProtectedRoute>
            } />
          <Route path="/laboratory/:userId/profile" element={
              <ProtectedRoute>
                <LaboratoryProfile />
              </ProtectedRoute>
            }/>
          <Route path="/hospital/:userId/profile" element={
              <ProtectedRoute>
                <HospitalProfile />
              </ProtectedRoute>
          }/>

          {/* ---------------- Profile Pages End---------------- */}

          <Route path="/receiver/:userId/hospitals" element={
              <ProtectedRoute>
                <Hospitals />
              </ProtectedRoute>
            }
          />


        </Routes>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={10}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            style: {
              zIndex: 20000,
              border: "1px solid #D1D5DC",
              borderRadius: "4px",
              height: "35px",
              fontSize: "12px",
            },
          }}
        />
      </div>
    </>
  );
}

export default App;
