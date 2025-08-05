
import { Plus, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillItem, clothTypes } from "@/types/billing";
import MeasurementFields from "./MeasurementFields";

interface ItemsFormProps {
  items: BillItem[];
  onAddItem: () => void;
  onUpdateItem: (index: number, field: keyof BillItem, value: any) => void;
  onUpdateMeasurement: (itemIndex: number, measurementField: string, value: string) => void;
  onRemoveItem: (index: number) => void;
  onSaveItems?: () => void;
}

const ItemsForm = ({ items, onAddItem, onUpdateItem, onUpdateMeasurement, onRemoveItem, onSaveItems }: ItemsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Items & Measurements
          <div className="flex gap-2">
            {onSaveItems && (
              <Button onClick={onSaveItems} variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Items
              </Button>
            )}
            <Button onClick={onAddItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Garment Type *</Label>
                <Select value={item.clothType} onValueChange={(value) => onUpdateItem(index, 'clothType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {clothTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => onUpdateItem(index, 'qty', parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label>Rate (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={item.rate}
                  onChange={(e) => onUpdateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                  disabled={items.length === 1}
                >
                  Remove
                </Button>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={item.description || ""}
                onChange={(e) => onUpdateItem(index, 'description', e.target.value)}
                placeholder="Enter item description..."
                rows={2}
              />
            </div>

            <MeasurementFields
              clothType={item.clothType}
              measurements={item.measurements}
              onMeasurementChange={(field, value) => onUpdateMeasurement(index, field, value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ItemsForm;
