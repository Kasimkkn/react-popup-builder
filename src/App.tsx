
import { ThemeProvider } from "next-themes";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { PopupProvider } from "./contexts/PopupContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PopupProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </PopupProvider>
    </ThemeProvider>
  );
}

export default App;
