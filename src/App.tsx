
import { ThemeProvider } from "next-themes";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { PopupProvider } from "./contexts/PopupContext";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor.tsx";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PopupProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </PopupProvider>
    </ThemeProvider>
  );
}

export default App;