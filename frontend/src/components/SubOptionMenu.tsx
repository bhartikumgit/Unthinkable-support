import { useEffect, useState } from 'react';

interface SubOptionMenuProps {
  mainOption: string;
  onSelect: (subOption: string) => void;
}

// This would typically come from your FAQ data
const subOptions: Record<string, string[]> = {
  Account: [
    'Reset Password',
    'Update Email',
    'Delete Account',
    'Two-Factor Authentication',
    'Account Security',
  ],
  Orders: [
    'Track Order',
    'Cancel Order',
    'Missing Items',
    'Order Status',
    'Bulk Orders',
  ],
  Returns: [
    'Return Policy',
    'Start Return',
    'Return Status',
    'Refund Timeline',
    'Wrong Item',
  ],
  Payments: [
    'Payment Methods',
    'Failed Payment',
    'Add Payment Method',
    'Remove Payment',
    'Payment Security',
  ],
  Technical: [
    'Browser Issues',
    'Mobile App',
    'Login Problems',
    'Website Speed',
    'Error Messages',
  ],
};

const SubOptionMenu = ({ mainOption, onSelect }: SubOptionMenuProps) => {
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setOptions(subOptions[mainOption] || []);
    setSelected(null);
  }, [mainOption]);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
  };

  if (!options.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-md font-medium text-gray-700">
        Select a specific topic:
      </h3>
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
              selected === option
                ? 'bg-brand-1 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-brand-1/30 hover:border-brand-1'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubOptionMenu;