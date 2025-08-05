
import { useState } from "react";
import { MessageSquare, Send, CheckCircle, Clock, User, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const TailorNotifications = () => {
  const [tailors] = useState([
    { id: 1, name: "Ramesh Kumar", mobile: "9876543210", speciality: "Shirts & Formal" },
    { id: 2, name: "Lakshmi Devi", mobile: "9876543211", speciality: "Blouses & Traditional" },
    { id: 3, name: "Suresh Babu", mobile: "9876543212", speciality: "Alterations & Repairs" }
  ]);

  const [orders] = useState([
    {
      id: "ST1706234567",
      customerName: "Rajesh Kumar",
      clothType: "Shirt",
      deliveryDate: "2024-02-15",
      instructions: "Slim fit, French cut sleeves",
      status: "Pending Assignment",
      designImage: "shirt_design.jpg"
    },
    {
      id: "ST1706234568",
      customerName: "Priya Sharma",
      clothType: "Blouse",
      deliveryDate: "2024-02-12",
      instructions: "Traditional design with mirror work",
      status: "Assigned",
      assignedTailor: 2,
      designImage: "blouse_design.jpg"
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      orderId: "ST1706234568",
      tailorId: 2,
      status: "Sent",
      sentAt: "2024-01-26 10:30 AM",
      method: "WhatsApp"
    }
  ]);

  const [selectedTailor, setSelectedTailor] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");

  const sendNotification = (method) => {
    if (!selectedTailor || !selectedOrder) {
      toast({
        title: "Missing Selection",
        description: "Please select both tailor and order",
        variant: "destructive"
      });
      return;
    }

    const tailor = tailors.find(t => t.id === parseInt(selectedTailor));
    const order = orders.find(o => o.id === selectedOrder);

    const notification = {
      id: notifications.length + 1,
      orderId: selectedOrder,
      tailorId: parseInt(selectedTailor),
      status: "Sent",
      sentAt: new Date().toLocaleString(),
      method: method
    };

    setNotifications([...notifications, notification]);

    toast({
      title: `${method} Sent Successfully`,
      description: `Notification sent to ${tailor.name} for order ${order.id}`,
    });

    // Simulate message content
    const messageContent = `
🧵 STAR TAILORS - New Work Assignment

👤 Customer: ${order.customerName}
👔 Item: ${order.clothType}
📅 Delivery: ${order.deliveryDate}
📝 Instructions: ${order.instructions}
📱 For queries: Contact office

Please confirm receipt of this message.
    `;

    console.log(`${method} Message to ${tailor.name} (${tailor.mobile}):`);
    console.log(messageContent);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Sent": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Tailor Notifications</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {notifications.filter(n => n.status === 'Sent').length} Sent Today
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Send Work Assignment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Tailor
              </label>
              <Select value={selectedTailor} onValueChange={setSelectedTailor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose tailor..." />
                </SelectTrigger>
                <SelectContent>
                  {tailors.map(tailor => (
                    <SelectItem key={tailor.id} value={tailor.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{tailor.name}</div>
                          <div className="text-xs text-gray-500">
                            {tailor.mobile} • {tailor.speciality}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Order
              </label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose order..." />
                </SelectTrigger>
                <SelectContent>
                  {orders.map(order => (
                    <SelectItem key={order.id} value={order.id}>
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-xs text-gray-500">
                          {order.customerName} • {order.clothType} • Due: {order.deliveryDate}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTailor && selectedOrder && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Preview Message:</h4>
                <div className="text-sm text-blue-800">
                  <p>🧵 <strong>STAR TAILORS</strong> - New Work Assignment</p>
                  <p>👤 Customer: {orders.find(o => o.id === selectedOrder)?.customerName}</p>
                  <p>👔 Item: {orders.find(o => o.id === selectedOrder)?.clothType}</p>
                  <p>📅 Delivery: {orders.find(o => o.id === selectedOrder)?.deliveryDate}</p>
                  <p>📝 Instructions: {orders.find(o => o.id === selectedOrder)?.instructions}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => sendNotification("WhatsApp")}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!selectedTailor || !selectedOrder}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send WhatsApp
              </Button>
              <Button 
                onClick={() => sendNotification("SMS")}
                variant="outline"
                disabled={!selectedTailor || !selectedOrder}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Send SMS
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Notification History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications sent yet</p>
              ) : (
                notifications.reverse().map(notification => {
                  const tailor = tailors.find(t => t.id === notification.tailorId);
                  const order = orders.find(o => o.id === notification.orderId);
                  
                  return (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-sm">{order?.customerName}</div>
                          <div className="text-xs text-gray-600">Order: {notification.orderId}</div>
                        </div>
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span>{tailor?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-3 w-3" />
                          <span>{notification.method}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2">
                        Sent: {notification.sentAt}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tailors Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Available Tailors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tailors.map(tailor => {
              const assignedOrders = notifications.filter(n => n.tailorId === tailor.id).length;
              return (
                <div key={tailor.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{tailor.name}</h4>
                      <p className="text-sm text-gray-600">{tailor.mobile}</p>
                      <p className="text-xs text-gray-500">{tailor.speciality}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {assignedOrders} Orders Assigned
                    </Badge>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TailorNotifications;
