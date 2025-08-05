
import { useState } from "react";
import { Download, FileText, Calendar, DollarSign, Users, Package, BarChart3, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const ReportsPage = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: "2024-01-01",
    endDate: "2024-01-31"
  });
  
  const [searchTerm, setSearchTerm] = useState("");

  const [reportData] = useState({
    totalSales: 125000,
    totalOrders: 245,
    pendingPayments: 15000,
    completedOrders: 198,
    pendingOrders: 47,
    topTailors: [
      { name: "Ramesh Kumar", orders: 45, revenue: 35000 },
      { name: "Lakshmi Devi", orders: 38, revenue: 28500 },
      { name: "Suresh Babu", orders: 32, revenue: 22000 }
    ],
    recentTransactions: [
      { id: "ST1706234567", customer: "Rajesh Kumar", amount: 1200, date: "2024-01-26", status: "Paid" },
      { id: "ST1706234568", customer: "Priya Sharma", amount: 1500, date: "2024-01-25", status: "Pending" },
      { id: "ST1706234569", customer: "Amit Singh", amount: 800, date: "2024-01-24", status: "Paid" },
      { id: "ST1706234570", customer: "Sunita Devi", amount: 2200, date: "2024-01-23", status: "Paid" }
    ],
    monthlyData: [
      { month: "Jan", sales: 125000, orders: 245 },
      { month: "Dec", sales: 98000, orders: 189 },
      { month: "Nov", sales: 110000, orders: 210 }
    ],
    tailorWorkReport: [
      { id: 1, tailorName: "Ramesh Kumar", workType: "Shirt Stitching", billNumber: "ST1001", customerName: "Rajesh Kumar", dateAssigned: "2024-01-20", expectedDelivery: "2024-01-25", status: "In Progress" },
      { id: 2, tailorName: "Lakshmi Devi", workType: "Blouse Alteration", billNumber: "ST1002", customerName: "Priya Sharma", dateAssigned: "2024-01-21", expectedDelivery: "2024-01-24", status: "Done" },
      { id: 3, tailorName: "Suresh Babu", workType: "Pant Hemming", billNumber: "ST1003", customerName: "Amit Singh", dateAssigned: "2024-01-22", expectedDelivery: "2024-01-26", status: "Pending" },
      { id: 4, tailorName: "Ramesh Kumar", workType: "Kurti Stitching", billNumber: "ST1004", customerName: "Sunita Devi", dateAssigned: "2024-01-23", expectedDelivery: "2024-01-28", status: "In Progress" },
      { id: 5, tailorName: "Lakshmi Devi", workType: "Saree Blouse", billNumber: "ST1005", customerName: "Meera Patel", dateAssigned: "2024-01-24", expectedDelivery: "2024-01-27", status: "Done" }
    ]
  });

  const generateReport = (format) => {
    toast({
      title: "Report Generated",
      description: `${format} report has been generated and downloaded`,
    });
    
    // Simulate file download
    console.log(`Generating ${format} report for period: ${dateFilter.startDate} to ${dateFilter.endDate}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Done": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const filteredTailorWork = reportData.tailorWorkReport.filter(work =>
    work.tailorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {dateFilter.startDate} to {dateFilter.endDate}
            </span>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Filter Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
              />
            </div>
            <div>
              <Label>Export Format</Label>
              <div className="flex space-x-2">
                <Button onClick={() => generateReport("PDF")} variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={() => generateReport("CSV")} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reportData.totalSales.toLocaleString()}</div>
            <p className="text-xs text-blue-100">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalOrders}</div>
            <p className="text-xs text-green-100">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reportData.pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-orange-100">{reportData.recentTransactions.filter(t => t.status === 'Pending').length} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((reportData.completedOrders / reportData.totalOrders) * 100)}%
            </div>
            <p className="text-xs text-purple-100">{reportData.completedOrders} of {reportData.totalOrders} orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Tailors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Tailor Workload</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topTailors.map((tailor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{tailor.name}</div>
                      <div className="text-sm text-gray-600">{tailor.orders} orders completed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{tailor.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Recent Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{transaction.customer}</div>
                    <div className="text-sm text-gray-600">{transaction.id}</div>
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{transaction.amount}</div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tailor Work Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Tailor Work Report</span>
          </CardTitle>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by tailor or bill number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => generateReport("PDF")} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={() => generateReport("Excel")} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-700">Tailor Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Work Type</th>
                  <th className="text-left p-4 font-medium text-gray-700">Bill Number</th>
                  <th className="text-left p-4 font-medium text-gray-700">Customer Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Date Assigned</th>
                  <th className="text-left p-4 font-medium text-gray-700">Expected Delivery</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTailorWork.map((work) => (
                  <tr key={work.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{work.tailorName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{work.workType}</td>
                    <td className="p-4 font-medium text-blue-600">{work.billNumber}</td>
                    <td className="p-4 text-gray-600">{work.customerName}</td>
                    <td className="p-4 text-gray-600">{work.dateAssigned}</td>
                    <td className="p-4 text-gray-600">{work.expectedDelivery}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(work.status)}>
                        {work.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Monthly Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportData.monthlyData.map((month) => (
              <div key={month.month} className="text-center p-4 border rounded-lg">
                <div className="text-lg font-bold text-gray-800">{month.month}</div>
                <div className="text-2xl font-bold text-blue-600">₹{month.sales.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{month.orders} orders</div>
                <div className="text-xs text-gray-500">
                  Avg: ₹{Math.round(month.sales / month.orders)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
