
import { useState, useEffect } from "react";
import { Users, Package, DollarSign, Bell, FileText, User, MessageSquare, BarChart3, Activity, Scissors, Shirt, Sparkles, Zap } from "lucide-react";
import { initializeSampleData } from "@/utils/sampleData";
import { Bill } from "@/types/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomerManagement from "@/components/CustomerManagement";
import BillingPage from "@/components/BillingPage";
import TailorNotifications from "@/components/TailorNotifications";
import ReportsPage from "@/components/ReportsPage";
import LoginPage from "@/components/LoginPage";
import TailorDashboard from "@/components/TailorDashboard";
import CuttingDepartmentTable from "@/components/CuttingDepartmentTable";
import BlouseStitchingPanel from "@/components/BlouseStitchingPanel";
import DressStitchingPanel from "@/components/DressStitchingPanel";
import FinishingPanel from "@/components/FinishingPanel";
import IroningPackingPanel from "@/components/IroningPackingPanel";
import FlowTracker from "@/components/FlowTracker";
import TodayOrderTracker from "@/components/TodayOrderTracker";
import OrdersTable from "@/components/OrdersTable";
import StitchingSection from "@/components/StitchingSection";
import FinishingSection from "@/components/FinishingSection";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [user, setUser] = useState(null);

  // Initialize sample data on component mount
  useEffect(() => {
    initializeSampleData();
  }, []);
  
  // Mock bills data for flow tracker
  const today = new Date().toISOString().split('T')[0];
  const [bills] = useState<Bill[]>([
    {
      id: "1",
      billNo: "1023",
      customerName: "Priya Sharma",
      mobile: "9876543210",
      status: "stitching" as const,
      items: [{ clothType: "Blouse", qty: 1, rate: 800, measurements: {} }],
      deliveryDate: "2024-01-20",
      tailorId: "blouse-stitching",
      tailorName: "Blouse Specialist",
      billDate: today, // Today's order
      advance: 500,
      balance: 300,
      totalAmount: 800,
      previousBalance: 0,
      designImage: null,
      instructions: ""
    },
    {
      id: "2",
      billNo: "1024",
      customerName: "Anita Reddy",
      mobile: "9876543211",
      status: "cutting" as const,
      items: [{ clothType: "Kurti", qty: 1, rate: 1200, measurements: {} }],
      deliveryDate: "2024-01-22",
      tailorId: "cutting",
      tailorName: "Cutting Expert",
      billDate: today, // Today's order
      advance: 600,
      balance: 600,
      totalAmount: 1200,
      previousBalance: 0,
      designImage: null,
      instructions: ""
    },
    {
      id: "3",
      billNo: "1025",
      customerName: "Meera Patel",
      mobile: "9876543212",
      status: "finishing" as const,
      items: [{ clothType: "Saree", qty: 1, rate: 2000, measurements: {} }],
      deliveryDate: "2024-01-25",
      tailorId: "finishing",
      tailorName: "Finishing Expert",
      billDate: today, // Today's order
      advance: 1000,
      balance: 1000,
      totalAmount: 2000,
      previousBalance: 0,
      designImage: null,
      instructions: ""
    },
    {
      id: "4",
      billNo: "1026",
      customerName: "Rajesh Kumar",
      mobile: "9876543213",
      status: "cutting" as const,
      items: [
        { clothType: "Kurti", qty: 1, rate: 900, measurements: {} },
        { clothType: "Pant", qty: 1, rate: 600, measurements: {} }
      ],
      deliveryDate: "2024-01-28",
      tailorId: "cutting",
      tailorName: "Cutting Expert",
      billDate: today, // Today's order
      advance: 800,
      balance: 700,
      totalAmount: 1500,
      previousBalance: 0,
      designImage: null,
      instructions: ""
    }
  ]);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "customers":
        return <CustomerManagement />;
      case "billing":
        return <BillingPage />;
      case "notifications":
        return <TailorNotifications />;
      case "reports":
        return <ReportsPage />;
      case "tailor-dashboard":
        // Show appropriate panel based on tailor role
        switch (user.role) {
          case 'cutting':
            return <CuttingDepartmentTable user={user} />;
          case 'blouse-stitching':
            return <BlouseStitchingPanel user={user} />;
          case 'dress-stitching':
            return <DressStitchingPanel user={user} />;
          case 'finishing':
            return <FinishingPanel user={user} />;
          case 'ironing':
            return <IroningPackingPanel user={user} />;
          default:
            return <TailorDashboard user={user} />;
        }
      case "flow-tracker":
        return <FlowTracker bills={bills} />;
      case "orders":
        return <OrdersTable bills={bills} />;
      case "stitching-section":
        return <StitchingSection />;
      case "finishing-section":
        return <FinishingSection />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} user={user} bills={bills} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-bold text-xl">ST</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">STAR TAILORS</h1>
                <p className="text-blue-200 text-sm">Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-200">Welcome, {user.name}</span>
              <Button 
                variant="outline" 
                size="sm"
                className="text-blue-900 border-white hover:bg-white"
                onClick={() => setUser(null)}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {currentPage !== "dashboard" && (
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <Button
              variant="ghost"
              onClick={() => setCurrentPage("dashboard")}
              className="text-blue-900 hover:bg-blue-50"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderPage()}
      </main>
    </div>
  );
};

const Dashboard = ({ setCurrentPage, user, bills }) => {
  const hasAccess = (section) => {
    if (user.role === "Admin") return ["customers", "reports", "stitching-section", "finishing-section"].includes(section);
    if (user.role === "Billing Staff") return ["billing", "customers"].includes(section);
    if (["cutting", "blouse-stitching", "dress-stitching", "finishing", "ironing"].includes(user.role)) {
      return ["notifications", "tailor-dashboard"].includes(section);
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome to STAR TAILORS</h2>
        <p className="text-gray-600">Your complete tailoring business management solution</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-blue-100">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-orange-100">Due this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Income</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,450</div>
            <p className="text-xs text-green-100">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-purple-100">New notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Order Tracker - Admin Only */}
      {user.role === "Admin" && (
        <TodayOrderTracker bills={bills} />
      )}

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hasAccess("billing") && (
          <Button 
            onClick={() => setCurrentPage("billing")}
            className="h-24 bg-gradient-to-br from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <FileText className="h-8 w-8" />
            <span className="text-lg font-semibold">Billing</span>
          </Button>
        )}

        {hasAccess("customers") && (
          <Button 
            onClick={() => setCurrentPage("customers")}
            className="h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <User className="h-8 w-8" />
            <span className="text-lg font-semibold">Customers</span>
          </Button>
        )}

        {hasAccess("reports") && (
          <Button 
            onClick={() => setCurrentPage("reports")}
            className="h-24 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <BarChart3 className="h-8 w-8" />
            <span className="text-lg font-semibold">Reports</span>
          </Button>
        )}

        {user.role === "Admin" && (
          <Button 
            onClick={() => setCurrentPage("flow-tracker")}
            className="h-24 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <Activity className="h-8 w-8" />
            <span className="text-lg font-semibold">Flow Tracker</span>
          </Button>
        )}

        <Button 
          onClick={() => setCurrentPage("orders")}
          className="h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white flex flex-col items-center justify-center space-y-2"
        >
          <Package className="h-8 w-8" />
          <span className="text-lg font-semibold">All Orders</span>
        </Button>

        {hasAccess("stitching-section") && (
          <Button 
            onClick={() => setCurrentPage("stitching-section")}
            className="h-24 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <MessageSquare className="h-8 w-8" />
            <span className="text-lg font-semibold">Stitching Section</span>
          </Button>
        )}

        {hasAccess("finishing-section") && (
          <Button 
            onClick={() => setCurrentPage("finishing-section")}
            className="h-24 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <Package className="h-8 w-8" />
            <span className="text-lg font-semibold">Finishing Section</span>
          </Button>
        )}

        {/* Admin Stage Management Links - Admin Only */}
        {user.role === "Admin" && (
          <>
            <Button 
              onClick={() => window.location.href = "/admin/cutting"}
              className="h-24 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white flex flex-col items-center justify-center space-y-2"
            >
              <Scissors className="h-8 w-8" />
              <span className="text-lg font-semibold">Cutting Management</span>
            </Button>

            <Button 
              onClick={() => window.location.href = "/admin/stitching"}
              className="h-24 bg-gradient-to-br from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white flex flex-col items-center justify-center space-y-2"
            >
              <Shirt className="h-8 w-8" />
              <span className="text-lg font-semibold">Stitching Management</span>
            </Button>

            <Button 
              onClick={() => window.location.href = "/admin/finishing"}
              className="h-24 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white flex flex-col items-center justify-center space-y-2"
            >
              <Sparkles className="h-8 w-8" />
              <span className="text-lg font-semibold">Finishing Management</span>
            </Button>

            <Button 
              onClick={() => window.location.href = "/admin/ironing"}
              className="h-24 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white flex flex-col items-center justify-center space-y-2"
            >
              <Zap className="h-8 w-8" />
              <span className="text-lg font-semibold">Ironing Management</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
