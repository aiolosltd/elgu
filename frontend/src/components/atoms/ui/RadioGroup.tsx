import React from 'react';

interface RadioGroupProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange, name }) => {
  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;