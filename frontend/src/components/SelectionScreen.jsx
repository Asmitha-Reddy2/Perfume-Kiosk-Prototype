import React from 'react';
import { useKioskStore, PERFUMES } from '../store/kioskStore';
import { useMutation } from '@tanstack/react-query';
import { kioskTheme } from '../lib/theme';
import { cn } from '../lib/utils';
import { PerfumeIcon, Spinner } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Slider } from './ui/slider';
import { createOrderApi } from '../lib/api';

const MAX_PUMPS = 10;

export default function SelectionScreen() {
  const { 
    selectedPerfumeId, 
    selectPerfume, 
    pumps, 
    setPumps, 
    setOrder, 
    getTotalPrice 
  } = useKioskStore();
  
  const perfume = PERFUMES[selectedPerfumeId];
  const totalPrice = getTotalPrice();

  // Get theme styles from tailwind-variants
  const { card, title, slider } = kioskTheme({ perfume: selectedPerfumeId });

  // TanStack Query mutation for creating an order
  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (data) => {
      // On success, update the Zustand store with the new order data
      // This will trigger the screen change in App.jsx
      console.log('[React] Order creation success. Updating store.');
      setOrder(data);
    },
    onError: (error) => {
      console.error('[React] Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPending) return;
    createOrder({ perfumeId: selectedPerfumeId, pumps });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className={cn(card(), "overflow-hidden")}>
        <CardHeader className="pb-2">
          <CardTitle className={cn(title(), "text-3xl flex items-center justify-between")}>
            <span>{perfume.name}</span>
            <PerfumeIcon name={perfume.icon} className="w-8 h-8 opacity-80" />
          </CardTitle>
          <CardDescription className="text-gray-400">{perfume.scent}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-2">
            {Object.keys(PERFUMES).map((id) => (
              <Button
                key={id}
                type="button"
                variant={selectedPerfumeId === id ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => selectPerfume(id)}
              >
                {PERFUMES[id].name}
              </Button>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="pumps" className="text-lg font-medium text-gray-300">
                Pumps
              </label>
              <span className="text-4xl font-bold text-white">{pumps}</span>
            </div>
            <Slider
              id="pumps"
              min={1}
              max={MAX_PUMPS}
              step={1}
              value={[pumps]}
              onValueChange={(value) => setPumps(value[0])}
              className={cn(slider())}
              disabled={isPending}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>{MAX_PUMPS}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-secondary/50 p-6 flex-col items-start">
          <div className="flex justify-between w-full">
            <span className="text-lg text-gray-400">Price per Pump:</span>
            <span className="text-lg font-medium text-white">₹{perfume.pricePerPump.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full mt-2">
            <span className="text-2xl font-bold text-white">Total Price:</span>
            <span className={cn(title(), "text-3xl font-bold")}>₹{totalPrice}</span>
          </div>
        </CardFooter>
      </Card>
      
      <Button type="submit" size="lg" className="w-full text-xl" disabled={isPending}>
        {isPending ? <Spinner className="mr-2" /> : null}
        {isPending ? 'Generating Order...' : `Pay ₹${totalPrice}`}
      </Button>
    </form>
  );
}