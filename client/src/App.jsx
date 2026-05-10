import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashBoard";
import ProtectedRoute from "./component/protectRoute";
import RoomPage from "./pages/roomPage";
import ProfilePage from "./pages/profilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/room/:id" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;