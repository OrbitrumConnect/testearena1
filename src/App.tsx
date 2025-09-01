import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PersistentBackgroundMusic } from "@/components/ui/persistent-background-music";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Training from "./pages/Training";
import ArenaNew from "./pages/ArenaNew";
import Mesopotamia from "./pages/Mesopotamia";
import Medieval from "./pages/Medieval";
import Digital from "./pages/Digital";
import Labyrinth from "./pages/Labyrinth";

import Knowledge from "./pages/Knowledge";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Ranking from "./pages/Ranking";
import Payment from "./pages/Payment";
import WorldQuiz from "./pages/WorldQuiz";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/legal/ProtectedRoute";

const queryClient = new QueryClient();

// Componente para controlar a música baseado na rota
const AppWithMusic = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isIndexPage = location.pathname === '/app';

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
        <Route path="/arena" element={<ProtectedRoute><ArenaNew /></ProtectedRoute>} />
        <Route path="/mesopotamia" element={<ProtectedRoute><Mesopotamia /></ProtectedRoute>} />
        <Route path="/medieval" element={<ProtectedRoute><Medieval /></ProtectedRoute>} />
        <Route path="/digital" element={<ProtectedRoute><Digital /></ProtectedRoute>} />
        <Route path="/labyrinth" element={<ProtectedRoute><Labyrinth /></ProtectedRoute>} />
        <Route path="/labyrinth/:era" element={<ProtectedRoute><Labyrinth /></ProtectedRoute>} />
        
        <Route path="/knowledge" element={<ProtectedRoute><Knowledge /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/world-quiz" element={<ProtectedRoute><WorldQuiz /></ProtectedRoute>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Música toca em todas as páginas EXCETO Landing e Index (que tem no cabeçalho) */}
      {!isLandingPage && !isIndexPage && <PersistentBackgroundMusic autoPlay={true} />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithMusic />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
