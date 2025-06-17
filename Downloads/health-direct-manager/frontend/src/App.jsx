import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManagerSignIn from "./pages/ManagerSignIn";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Doctors from "./pages/Doctors";
import AddDoctorForm from "./pages/AddDoctorForm";
import EditDoctorForm from "./pages/EditDoctorForm";
import Patients from "./pages/Patients";
import AddPatientForm from "./pages/AddPatientForm";
import PatientDetails from "./pages/PatientDetails";
import "./App.css";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { token, isLoading } = useContext(AuthContext);
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return token ? children : <Navigate to="/manager-signin" />;
  };

  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          <Route path="/manager-signin" element={<ManagerSignIn />} />
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dash"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/add"
            element={
              <ProtectedRoute>
                <AddDoctorForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/edit/:id"
            element={
              <ProtectedRoute>
                <EditDoctorForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/add"
            element={
              <ProtectedRoute>
                <AddPatientForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute>
                <PatientDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/manager-signin" />} />
          <Route path="*" element={<Navigate to="/manager-signin" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;