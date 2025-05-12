
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientForm from "./pages/ClientForm";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import AuthGuard from "./components/auth/AuthGuard";
import TeamManagement from "./pages/TeamManagement";
import StatusOfProspect from "./pages/StatusOfProspect";
import TodaysTasks from "./pages/TodaysTasks";
import EmailCommunicationHistory from "./pages/EmailCommunicationHistory";
import { AuthProvider } from "./contexts/AuthContext";

// Configure React Query for better real-time data handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 1000 * 60, // 1 minute
      retry: 2,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <AuthGuard>
              <Layout><Dashboard /></Layout>
            </AuthGuard>
          } />
          
          <Route path="/clients" element={
            <AuthGuard>
              <Layout><Clients /></Layout>
            </AuthGuard>
          } />
          
          <Route path="/clients/:id" element={
            <AuthGuard>
              <Layout><ClientDetail /></Layout>
            </AuthGuard>
          } />
          
          <Route path="/clients/new" element={
            <AuthGuard>
              <Layout><ClientForm /></Layout>
            </AuthGuard>
          } />
          
          <Route path="/team" element={
            <AuthGuard>
              <Layout><TeamManagement /></Layout>
            </AuthGuard>
          } />
          
          <Route path="/settings" element={
            <AuthGuard>
              <Layout><Settings /></Layout>
            </AuthGuard>
          } />
          
          <Route path="/communications" element={
            <AuthGuard>
              <Layout>
                <StatusOfProspect />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/email-communications" element={
            <AuthGuard>
              <Layout>
                <EmailCommunicationHistory />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="/todaystasks" element={
            <AuthGuard>
              <Layout>
                <TodaysTasks />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
