
import { useState } from "react";
import { Search, Plus, User, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      mobile: "9876543210",
      address: "123 MG Road, Bangalore",
      orders: [
        { id: 1, date: "2024-01-15", type: "Shirt", amount: 1200, status: "Delivered" },
        { id: 2, date: "2024-01-20", type: "Pant", amount: 800, status: "In Progress" }
      ],
      balance: 500
    },
    {
      id: 2,
      name: "Priya Sharma",
      mobile: "9876543211",
      address: "456 Brigade Road, Bangalore",
      orders: [
        { id: 3, date: "2024-01-18", type: "Blouse", amount: 1500, status: "Delivered" }
      ],
      balance: 0
    }
  ]);
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    mobile: "",
    address: ""
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.mobile) {
      const customer = {
        id: customers.length + 1,
        ...newCustomer,
        orders: [],
        balance: 0
      };
      setCustomers([...customers, customer]);
      setNewCustomer({ name: "", mobile: "", address: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Customer Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={newCustomer.mobile}
                  onChange={(e) => setNewCustomer({...newCustomer, mobile: e.target.value})}
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
              <Button onClick={handleAddCustomer} className="w-full">
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or mobile number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-700">Customer Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Bill Number</th>
                  <th className="text-left p-4 font-medium text-gray-700">Total Amount</th>
                  <th className="text-left p-4 font-medium text-gray-700">Contact Number</th>
                  <th className="text-left p-4 font-medium text-gray-700">Date</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => 
                  customer.orders.length > 0 ? customer.orders.map((order) => (
                    <tr key={`${customer.id}-${order.id}`} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">#{order.id.toString().padStart(4, '0')}</td>
                      <td className="p-4 font-semibold">₹{order.amount}</td>
                      <td className="p-4 text-gray-600">{customer.mobile}</td>
                      <td className="p-4 text-gray-600">{order.date}</td>
                      <td className="p-4">
                        <Badge 
                          variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                          className={order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">No bills</td>
                      <td className="p-4 text-gray-400">-</td>
                      <td className="p-4 text-gray-600">{customer.mobile}</td>
                      <td className="p-4 text-gray-400">-</td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-gray-500">
                          No orders
                        </Badge>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
