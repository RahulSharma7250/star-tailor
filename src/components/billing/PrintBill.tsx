
import { Bill } from "@/types/billing";

interface PrintBillProps {
  bill: Bill;
  onClose: () => void;
}

const PrintBill = ({ bill, onClose }: PrintBillProps) => {
  const handlePrint = () => {
    window.print();
  };

  const subtotal = bill.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);

  return (
    <div className="fixed inset-0 bg-white z-50 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-2xl font-bold">Print Preview</h2>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tailor Tag (Left - 1/3) */}
          <div className="border-2 border-dashed border-gray-400 p-4 bg-yellow-50">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">STAR TAILORS</h3>
              <p className="text-sm text-gray-600">Tailor Tag</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Bill No:</span>
                <span>{bill.billNo}</span>
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
                <span className="font-semibold">Delivery:</span>
                <span>{bill.deliveryDate}</span>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <h4 className="font-semibold mb-1">Items:</h4>
                {bill.items.map((item, index) => (
                  item.clothType && (
                    <div key={index} className="text-xs">
                      {item.clothType} x {item.qty}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Full Bill (Right - 2/3) */}
          <div className="lg:col-span-2 border border-gray-300 p-6 bg-white">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-blue-900">STAR TAILORS</h1>
              <p className="text-gray-600">Professional Tailoring Services</p>
              <p className="text-sm text-gray-500">Management System</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p><span className="font-semibold">Bill No:</span> {bill.billNo}</p>
                <p><span className="font-semibold">Date:</span> {bill.billDate}</p>
                <p><span className="font-semibold">Customer:</span> {bill.customerName}</p>
                <p><span className="font-semibold">Mobile:</span> {bill.mobile}</p>
              </div>
              <div>
                <p><span className="font-semibold">Delivery Date:</span> {bill.deliveryDate}</p>
                {bill.previousBalance > 0 && (
                  <p><span className="font-semibold">Previous Balance:</span> ₹{bill.previousBalance}</p>
                )}
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Item</th>
                  <th className="border border-gray-300 p-2 text-center">Qty</th>
                  <th className="border border-gray-300 p-2 text-right">Rate</th>
                  <th className="border border-gray-300 p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  item.clothType && (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {item.clothType}
                        {item.description && (
                          <div className="text-xs text-gray-600">{item.description}</div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">{item.qty}</td>
                      <td className="border border-gray-300 p-2 text-right">₹{item.rate}</td>
                      <td className="border border-gray-300 p-2 text-right">₹{item.qty * item.rate}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>

            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {bill.previousBalance > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Previous Balance:</span>
                      <span>₹{bill.previousBalance}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-1">
                    <span>Total Amount:</span>
                    <span>₹{bill.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Advance:</span>
                    <span>₹{bill.advance}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Balance:</span>
                    <span>₹{bill.balance}</span>
                  </div>
                </div>
              </div>
            </div>

            {bill.instructions && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold mb-1">Instructions:</h4>
                <p className="text-sm">{bill.instructions}</p>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Thank you for choosing STAR TAILORS!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintBill;
