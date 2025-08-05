import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OrderPage from "./pages/OrderPage";
import CuttingPage from "./pages/CuttingPage";
import BlouseStitchingPage from "./pages/BlouseStitchingPage";
import DressStitchingPage from "./pages/DressStitchingPage";
import BlouseFinishingPage from "./pages/BlouseFinishingPage";
import DressFinishingPage from "./pages/DressFinishingPage";
import IroningPage from "./pages/IroningPage";
import AdminCuttingPage from "./pages/AdminCuttingPage";
import AdminStitchingPage from "./pages/AdminStitchingPage";
import AdminFinishingPage from "./pages/AdminFinishingPage";
import AdminIroningPage from "./pages/AdminIroningPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/cutting" element={<CuttingPage />} />
          <Route path="/blouse-stitching" element={<BlouseStitchingPage />} />
          <Route path="/dress-stitching" element={<DressStitchingPage />} />
          <Route path="/blouse-finishing" element={<BlouseFinishingPage />} />
          <Route path="/dress-finishing" element={<DressFinishingPage />} />
          <Route path="/ironing" element={<IroningPage />} />
          {/* Admin Routes */}
          <Route path="/admin/cutting" element={<AdminCuttingPage />} />
          <Route path="/admin/stitching" element={<AdminStitchingPage />} />
          <Route path="/admin/finishing" element={<AdminFinishingPage />} />
          <Route path="/admin/ironing" element={<AdminIroningPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
