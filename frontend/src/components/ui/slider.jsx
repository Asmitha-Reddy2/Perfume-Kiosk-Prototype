import React from 'react';
import { cn } from '../../lib/utils';

const Slider = React.forwardRef(({ className, value, onValueChange, ...props }, ref) => {
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange([Number(e.target.value)]);
    }
  };

  return (
    <input
      type="range"
      ref={ref}
      value={value?.[0] || value || 0}
      onChange={handleChange}
      className={cn(
        "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer",
        className
      )}
      {...props}
    />
  );
});

Slider.displayName = 'Slider';

export { Slider };