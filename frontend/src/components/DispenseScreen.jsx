import React from 'react';
import { useKioskStore } from '../store/kioskStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { kioskTheme } from '../lib/theme';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Spinner } from '../App';
import { dispatchOrderApi, fetchOrderStatusApi } from '../lib/api';

export default function DispenseScreen() {
  const { order, setScreen, selectedPerfumeId, setOrderStatus } = useKioskStore((state) => ({
    order: state.order,
    setScreen: state.setScreen,
    selectedPerfumeId: state.selectedPerfumeId,
    setOrderStatus: state.setOrderStatus,
  }));
  
  // Get theme styles
  const { card, title } = kioskTheme({ perfume: selectedPerfumeId });

  // Poll for order status to detect when dispensing is complete
  const { data: statusData } = useQuery({
    queryKey: ['orderStatus', order?.id],
    queryFn: () => fetchOrderStatusApi(order.id),
    refetchInterval: 1000,
    enabled: !!order && (order.status === 'DISPENSING' || order.status === 'PAID'),
  });

  React.useEffect(() => {
    if (statusData && statusData.status === 'DISPATCHED' && order.status !== 'DISPATCHED') {
      setOrderStatus('DISPATCHED');
      setScreen('COMPLETE');
    }
  }, [statusData, order?.status, setOrderStatus, setScreen]);

  // TanStack Query mutation for dispatching
  const { mutate: dispatchOrder, isPending: isDispensing } = useMutation({
    mutationFn: () => dispatchOrderApi(order.id),
    onSuccess: (data) => {
      console.log('[React] Dispense started.');
      setOrderStatus('DISPENSING');
    },
    onError: (error) => {
      console.error('[React] Dispense failed:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    },
  });

  const handleDispatch = () => {
    if (order) {
      dispatchOrder();
    }
  };

  if (!order) {
    return <div>Error: No Order.</div>; // Should not happen
  }

  const isDispensingHardware = order.status === 'DISPENSING' || order.status === 'DISPATCHED';

  return (
    <div className="space-y-6 text-center animate-in fade-in-50 duration-500">
      <Card className={cn(card())}>
        <CardHeader>
          <CardTitle className={cn(title(), "text-4xl text-green-400")}>
            ✅ Payment Confirmed!
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Ready to dispense {order.pumps} pumps of {order.perfumeName}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="p-6 bg-gray-800 rounded-xl border-4 border-red-500/80 animate-pulse-strong">
            <h3 className="text-3xl font-bold text-red-400">
              PRESS THE PHYSICAL BUTTON NOW!
            </h3>
            <p className="text-lg text-gray-400 mt-2">
              Please place your bottle under the nozzle.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            (For prototype: Click the button below to simulate the physical press)
          </p>

          <Button 
            onClick={handleDispatch}
            disabled={isDispensingHardware}
            variant="destructive"
            size="lg"
            className="w-full text-xl"
          >
            {isDispensingHardware ? <Spinner className="mr-2" /> : null}
            {isDispensingHardware ? `Dispensing...` : 'Simulate Physical Button'}
          </Button>
          
        </CardContent>
      </Card>
    </div>
  );
}