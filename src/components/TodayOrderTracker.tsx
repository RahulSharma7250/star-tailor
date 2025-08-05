import { useState } from "react";
import { Eye, Clock, CheckCircle } from "lucide-react";
import { Bill, getNextStatus } from "@/types/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TodayOrderTrackerProps {
  bills: Bill[];
}

const TodayOrderTracker = ({ bills }: TodayOrderTrackerProps) => {
  // Filter bills to show only today's orders
  const today = new Date().toISOString().split('T')[0];
  const todaysBills = bills.filter(bill => bill.billDate === today);

  const getStageColor = (stage: string, currentStatus: string, items: any[]) => {
    const hasSaree = items.some(item => item.clothType === 'Saree');
    
    // Define the workflow based on item type
    const workflow = hasSaree 
      ? ['finishing', 'ironing', 'completed']
      : ['cutting', 'stitching', 'finishing', 'ironing', 'completed'];
    
    const currentIndex = workflow.indexOf(currentStatus);
    const stageIndex = workflow.indexOf(stage);
    
    if (stageIndex < currentIndex || currentStatus === 'completed') {
      return 'bg-blue-500 text-white'; // Completed - Blue
    } else if (stageIndex === currentIndex) {
      return 'bg-purple-500 text-white'; // In Progress - Purple
    } else {
      return 'bg-gray-200 text-gray-600'; // Not Started - White/Gray
    }
  };

  const getStitchingLabel = (items: any[]) => {
    const hasBlouse = items.some(item => item.clothType === 'Blouse');
    const hasDress = items.some(item => ['Kurti', 'Jacket'].includes(item.clothType));
    
    if (hasBlouse && hasDress) return 'Blouse/Dress Stitching';
    if (hasBlouse) return 'Blouse Stitching';
    if (hasDress) return 'Dress Stitching';
    return 'Stitching';
  };

  const renderStageTracker = (bill: Bill) => {
    const hasSaree = bill.items.some(item => item.clothType === 'Saree');
    const stages = hasSaree 
      ? [
          { id: 'finishing', label: 'Finishing' },
          { id: 'ironing', label: 'Ironing' }
        ]
      : [
          { id: 'cutting', label: 'Cutting' },
          { id: 'stitching', label: getStitchingLabel(bill.items) },
          { id: 'finishing', label: 'Finishing' },
          { id: 'ironing', label: 'Ironing' }
        ];

    return (
      <div className="flex items-center space-x-2 overflow-x-auto">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <Badge 
              variant="secondary" 
              className={`${getStageColor(stage.id, bill.status, bill.items)} px-3 py-1 text-xs font-medium whitespace-nowrap`}
            >
              {stage.label}
            </Badge>
            {index < stages.length - 1 && (
              <div className="mx-2 text-gray-400">→</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (todaysBills.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Order Tracker (Today's Orders)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No orders placed today</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Order Tracker (Today's Orders)
          <Badge variant="secondary" className="ml-2">
            {todaysBills.length} orders
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysBills.map((bill) => (
            <Card key={bill.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {bill.customerName}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        #{bill.billNo}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {bill.items.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item.qty}x {item.clothType}
                        </Badge>
                      ))}
                    </div>

                    {/* Stage Progress Tracker */}
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-2">Progress:</p>
                      {renderStageTracker(bill)}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Order
                    </Button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary"
                      className={`${getStageColor(bill.status, bill.status, bill.items)} px-3 py-1`}
                    >
                      Current: {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Delivery: {new Date(bill.deliveryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayOrderTracker;