import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Circle, User, Package } from "lucide-react";
import { Bill, orderStatuses, clothTypes, tailorRoles } from "@/types/billing";

interface FlowTrackerProps {
  bills: Bill[];
}

const FlowTracker = ({ bills }: FlowTrackerProps) => {
  const [filteredBills, setFilteredBills] = useState<Bill[]>(bills);
  const [filters, setFilters] = useState({
    orderType: "all",
    currentStage: "all",
    tailorId: "all"
  });

  useEffect(() => {
    let filtered = bills;

    if (filters.orderType !== "all") {
      filtered = filtered.filter(bill => 
        bill.items.some(item => item.clothType === filters.orderType)
      );
    }

    if (filters.currentStage !== "all") {
      filtered = filtered.filter(bill => bill.status === filters.currentStage);
    }

    if (filters.tailorId !== "all") {
      filtered = filtered.filter(bill => bill.tailorId === filters.tailorId);
    }

    setFilteredBills(filtered);
  }, [bills, filters]);

  const getStageProgress = (bill: Bill) => {
    const hasSaree = bill.items.some(item => item.clothType === 'Saree');
    const stages = hasSaree 
      ? ['pending', 'finishing', 'ironing', 'completed']
      : ['pending', 'cutting', 'stitching', 'finishing', 'ironing', 'completed'];
    
    const currentIndex = stages.indexOf(bill.status);
    return {
      stages,
      currentIndex,
      progress: ((currentIndex + 1) / stages.length) * 100
    };
  };

  const getStageIcon = (stage: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    if (isCurrent) {
      return <Clock className="w-6 h-6 text-blue-500" />;
    }
    return <Circle className="w-6 h-6 text-gray-300" />;
  };

  const getStageColor = (stage: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return "bg-green-500";
    if (isCurrent) return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Flow Tracker - Order Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Order Type</label>
                <Select value={filters.orderType} onValueChange={(value) => setFilters(prev => ({...prev, orderType: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {clothTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Current Stage</label>
                <Select value={filters.currentStage} onValueChange={(value) => setFilters(prev => ({...prev, currentStage: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {orderStatuses.map(status => (
                      <SelectItem key={status.id} value={status.id}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Assigned Tailor</label>
                <Select value={filters.tailorId} onValueChange={(value) => setFilters(prev => ({...prev, tailorId: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Tailors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tailors</SelectItem>
                    {tailorRoles.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {filteredBills.map((bill) => {
          const { stages, currentIndex, progress } = getStageProgress(bill);
          const statusInfo = orderStatuses.find(s => s.id === bill.status);
          
          return (
            <Card key={bill.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">Bill #{bill.billNo}</h3>
                      <p className="text-sm text-muted-foreground">{bill.customerName}</p>
                    </div>
                    <Badge className={`${statusInfo?.bgColor} ${statusInfo?.color}`}>
                      {statusInfo?.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Delivery: {bill.deliveryDate}</p>
                      <p className="text-xs text-muted-foreground">
                        Items: {bill.items.map(item => item.clothType).join(", ")}
                      </p>
                    </div>
                    {bill.tailorName && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {bill.tailorName}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    {stages.map((stage, index) => {
                      const isCompleted = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      const stageInfo = orderStatuses.find(s => s.id === stage);
                      
                      return (
                        <div key={stage} className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStageColor(stage, isCompleted, isCurrent)}`}>
                            {getStageIcon(stage, isCompleted, isCurrent)}
                          </div>
                          <span className={`text-xs text-center ${isCurrent ? 'font-semibold' : 'text-muted-foreground'}`}>
                            {stageInfo?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBills.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found matching the current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlowTracker;