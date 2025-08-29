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
import Knowledge from "./pages/Knowledge";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Ranking from "./pages/Ranking";
import Payment from "./pages/Payment";
import WorldQuiz from "./pages/WorldQuiz";
import NotFound from "./pages/NotFound";

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
        <Route path="/app" element={<Index />} />
        <Route path="/training" element={<Training />} />
        <Route path="/arena" element={<ArenaNew />} />
        <Route path="/mesopotamia" element={<Mesopotamia />} />
        <Route path="/medieval" element={<Medieval />} />
        <Route path="/digital" element={<Digital />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/world-quiz" element={<WorldQuiz />} />
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
