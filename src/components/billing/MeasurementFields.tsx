
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { measurementFields } from "@/types/billing";

interface MeasurementFieldsProps {
  clothType: string;
  measurements: Record<string, string>;
  onMeasurementChange: (field: string, value: string) => void;
}

const MeasurementFields = ({ clothType, measurements, onMeasurementChange }: MeasurementFieldsProps) => {
  if (!clothType || !measurementFields[clothType]) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
        Measurements for {clothType}
      </Label>
      {clothType === "Other" ? (
        <div>
          <Label>Custom Measurements</Label>
          <Textarea
            value={measurements["Custom Measurements"] || ""}
            onChange={(e) => onMeasurementChange("Custom Measurements", e.target.value)}
            placeholder="Enter custom measurements..."
            rows={3}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {measurementFields[clothType].map((field) => (
            <div key={field}>
              <Label className="text-xs">{field}</Label>
              <Input
                type="number"
                step="0.1"
                value={measurements[field] || ""}
                onChange={(e) => onMeasurementChange(field, e.target.value)}
                placeholder="0"
                className="text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeasurementFields;
