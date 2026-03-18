import React from "react";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (method: "esewa" | "khalti") => void;
  amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, onSelect, amount }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Pay for Reservation</h2>
        <p className="mb-4">Amount: <span className="font-semibold">Rs. {amount}</span></p>
        <div className="flex flex-col gap-3">
          <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600" onClick={() => onSelect("esewa")}>Pay with eSewa</button>
          <button className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700" onClick={() => onSelect("khalti")}>Pay with Khalti</button>
        </div>
        <button className="mt-6 text-gray-500 hover:text-gray-700" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PaymentModal;
