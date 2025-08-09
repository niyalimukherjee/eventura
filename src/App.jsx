import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import EventCreation from "./pages/EventCreation";
import EventDetailsPage from "./pages/EventDetailsPage";
import { EventProvider } from "./context/EventContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SignIn from "./pages/auth/SignIn";
import SignUpWizard from "./pages/auth/SignUpWizard";
import RsvpDashboard from "./components/rsvp/RsvpDashboard"; // NEW

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />;
}

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Navbar />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUpWizard />} />

          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/event-create" element={<PrivateRoute><EventCreation /></PrivateRoute>} />
          <Route path="/event/:id" element={<PrivateRoute><EventDetailsPage /></PrivateRoute>} />
            <Route path="/rsvp" element={<RsvpDashboard />} />
  <Route path="/rsvp/:eventId" element={<RsvpDashboard />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
