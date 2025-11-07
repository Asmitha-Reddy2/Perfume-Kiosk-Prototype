import React from 'react';
import { useKioskStore } from '../store/kioskStore';
import { kioskTheme } from '../lib/theme';
import { cn } from '../lib/utils';

export default function CompleteScreen() {
  const { order, reset, selectedPerfumeId } = useKioskStore((state) => ({
    order: state.order,
    reset: state.reset,
    selectedPerfumeId: state.selectedPerfumeId,
  }));
  
  const { card, title } = kioskTheme({ perfume: selectedPerfumeId });

  // Automatically reset to the home screen after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      reset();
    }, 5000); // 5-second delay
    
    // Clear timer if the component unmounts
    return () => clearTimeout(timer);
  }, [reset]);

  if (!order) {
    // This can happen if the page is reloaded.
    // In that case, just force a reset.
    React.useEffect(() => {
      reset();
    }, [reset]);
    return null;
  }

  return (
    <div className="space-y-6 text-center animate-in fade-in-50 duration-500">
      <Card className={cn(card(), "py-12")}>
        <CardContent className="space-y-4">
          <div className="text-8xl mb-4">✨</div>
          <h2 className={cn(title(), "text-4xl font-extrabold")}>
            Dispense Complete!
          </h2>
          <p className="text-xl text-gray-300">
            You received {order.pumps} pumps of {order.perfumeName}.
          </p>
          <p className="text-lg text-gray-400">
            Thank you! Returning to home screen...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}