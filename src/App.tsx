import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
                <Clients />
              </Layout>
            </AuthGuard>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
