
import React from 'react';
import { OrderStatus } from '../types';
import { STATUS_OPTIONS, STATUS_COLORS } from '../constants';

interface StatusDropdownProps {
  currentStatus: OrderStatus;
  onChange: (newStatus: OrderStatus) => void;
  disabled: boolean;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, onChange, disabled }) => {
  const colorClass = STATUS_COLORS[currentStatus] || 'bg-gray-100 text-gray-800';

  return (
    <select
      value={currentStatus}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      disabled={disabled}
      className={`text-xs font-medium px-2.5 py-1.5 rounded-full w-full appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${colorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {STATUS_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
