import { useState } from 'react';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  ArrowUturnLeftIcon,
  CreditCardIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

interface OptionMenuProps {
  onSelect: (option: string) => void;
}

const options = [
  { id: 'Account', icon: UserCircleIcon },
  { id: 'Orders', icon: ShoppingBagIcon },
  { id: 'Returns', icon: ArrowUturnLeftIcon },
  { id: 'Payments', icon: CreditCardIcon },
  { id: 'Technical', icon: ComputerDesktopIcon },
];

const OptionMenu = ({ onSelect }: OptionMenuProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    onSelect(optionId);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">How can we help?</h2>
      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`menu-option flex items-center gap-3 ${
              selected === option.id
                ? 'ring-2 ring-brand-1 bg-brand-1/5'
                : 'hover:bg-gray-50'
            }`}
          >
            <option.icon className="h-6 w-6 text-brand-1" />
            <span className="font-medium">{option.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionMenu;
