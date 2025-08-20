import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TideCloakContextProvider, Authenticated, Unauthenticated } from '@tidecloak/react';
import adapter from '../tidecloakAdapter.json';
import Index from "./pages/Index";
import Vault from "./pages/Vault";
import AuthRedirect from "./pages/AuthRedirect";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TideCloakContextProvider config={adapter}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vault" element={
              <Authenticated>
                <Vault />
              </Authenticated>
            } />
            <Route path="/auth/redirect" element={<AuthRedirect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TideCloakContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
