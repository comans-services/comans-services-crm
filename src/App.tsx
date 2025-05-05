
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
import Newsletters from "./pages/Newsletters";
import NewsletterForm from "./pages/NewsletterForm";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import KanbanBoard from "./pages/KanbanBoard";
import AuthGuard from "./components/auth/AuthGuard";
import TeamManagement from "./pages/TeamManagement";
import CommunicationHistory from "./pages/CommunicationHistory";
import TodaysTasks from "./pages/TodaysTasks";
import EmailCommunicationHistory from "./pages/EmailCommunicationHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
        
        <Route path="/clients/kanban" element={
          <AuthGuard>
            <Layout><KanbanBoard /></Layout>
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
        
        <Route path="/newsletters" element={
          <AuthGuard>
            <Layout><Newsletters /></Layout>
          </AuthGuard>
        } />
        
        <Route path="/newsletters/new" element={
          <AuthGuard>
            <Layout><NewsletterForm /></Layout>
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
              <CommunicationHistory />
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
  </QueryClientProvider>
);

export default App;
