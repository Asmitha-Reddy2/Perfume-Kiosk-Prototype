import React from 'react';
import { useKioskStore } from '../store/kioskStore';
import { useQuery } from '@tanstack/react-query';
import { kioskTheme } from '../lib/theme';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Spinner } from '../App';
import { fetchOrderStatusApi } from '../lib/api';


export default function PaymentScreen() {
  const { order, setOrderStatus, reset, selectedPerfumeId } = useKioskStore((state) => ({
    order: state.order,
    setOrderStatus: state.setOrderStatus,
    reset: state.reset,
    selectedPerfumeId: state.selectedPerfumeId
  }));

  // Get theme styles
  const { card, title } = kioskTheme({ perfume: selectedPerfumeId });

  // Use TanStack Query to poll for the order status
  const { data, isLoading } = useQuery({
    queryKey: ['orderStatus', order?.id],
    queryFn: () => fetchOrderStatusApi(order.id),
    refetchInterval: 2000,
    enabled: !!order && (order.status === 'CREATED' || order.status === 'PAID'),
  });
  
  React.useEffect(() => {
    if (data && data.status === 'PAID' && order.status !== 'PAID') {
      setOrderStatus('PAID');
    }
  }, [data, order?.status, setOrderStatus]);
  
  const currentStatus = data?.status || order?.status;

  if (!order) {
    return (
      <Card className={cn(card(), "text-center")}>
        <CardHeader>
          <CardTitle className={cn(title(), "text-red-400")}>Error</CardTitle>
          <CardDescription>No order found. Please go back.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={reset} variant="destructive">Start Over</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 text-center animate-in fade-in-50 duration-500">
      <Card className={cn(card())}>
        <CardHeader>
          <CardTitle className={cn(title(), "text-3xl")}>
            Scan to Pay
          </CardTitle>
          <CardDescription className="text-gray-400">
            Use any UPI app to complete the payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-6xl font-extrabold text-green-400">
            ₹{order.amount.toFixed(2)}
          </div>
          
          <div className="p-4 bg-white rounded-xl inline-block border-4 border-indigo-400">
            <img 
              src={order.qrCodeUrl} 
              alt="Razorpay QR Code" 
              className="w-64 h-64 mx-auto"
            />
          </div>

          <div className="flex items-center justify-center text-2xl font-semibold">
            <Spinner className="w-6 h-6 mr-3 text-yellow-400 animate-spin" />
            <span className="text-yellow-400 animate-pulse">
              Waiting for payment...
            </span>
          </div>
          
          <p className="text-sm text-gray-500">
            Order ID: {order.id}
          </p>
        </CardContent>
      </Card>
      
      <Button onClick={reset} variant="outline" size="lg" className="w-full">
        Cancel Order
      </Button>
    </div>
  );
}