import React from 'react';

interface DateTimePickerProps {
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  onChange?: (event: any, date?: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  display?: string;
}

export default function DateTimePicker({
  value,
  mode = 'date',
  onChange,
  minimumDate,
  maximumDate,
}: DateTimePickerProps) {
  const toInputValue = (d: Date) => {
    if (mode === 'date') {
      return d.toISOString().split('T')[0];
    }
    return d.toISOString().slice(0, 16);
  };

  const inputType = mode === 'time' ? 'time' : mode === 'datetime' ? 'datetime-local' : 'date';

  return (
    <input
      type={inputType}
      value={toInputValue(value)}
      min={minimumDate ? toInputValue(minimumDate) : undefined}
      max={maximumDate ? toInputValue(maximumDate) : undefined}
      onChange={e => {
        const d = new Date(e.target.value);
        if (!isNaN(d.getTime()) && onChange) {
          onChange({}, d);
        }
      }}
      style={{
        width: '100%',
        padding: '10px 12px',
        fontSize: 15,
        border: '1px solid #ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        color: '#1a1a1a',
        boxSizing: 'border-box',
      }}
    />
  );
}
