
import { Bill } from "@/types/billing";

interface PrintTailorTagProps {
  bill: Bill;
  onClose: () => void;
}

const PrintTailorTag = ({ bill, onClose }: PrintTailorTagProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-8 overflow-auto">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-2xl font-bold">Tailor Tag Preview</h2>
          <div className="space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-400 p-6 bg-yellow-50">
          <div className="text-center mb-4">
            <h3 className="font-bold text-2xl">STAR TAILORS</h3>
            <p className="text-gray-600">Tailor Tag</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">Bill No:</span>
              <span className="font-mono">{bill.billNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Customer:</span>
              <span className="text-right">{bill.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Mobile:</span>
              <span>{bill.mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery Date:</span>
              <span>{bill.deliveryDate}</span>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <h4 className="font-semibold mb-2">Items:</h4>
              <div className="space-y-1">
                {bill.items.map((item, index) => (
                  item.clothType && (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.clothType}</span>
                      <span>Qty: {item.qty}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {bill.instructions && (
              <div className="border-t pt-3 mt-3">
                <h4 className="font-semibold mb-1">Instructions:</h4>
                <p className="text-sm text-gray-700">{bill.instructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintTailorTag;
