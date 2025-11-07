import React from 'react';
import { useKioskStore } from './store/kioskStore';
import { kioskTheme } from './lib/theme';
import { cn } from './lib/utils';

// Import Screens
import SelectionScreen from './components/SelectionScreen.jsx';
import PaymentScreen from './components/PaymentScreen.jsx';
import DispenseScreen from './components/DispenseScreen.jsx';
import CompleteScreen from './components/CompleteScreen.jsx';

// Simple SVG Icons for perfumes
const Icons = {
  Sun: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
  Heart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Moon: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
};

export const PerfumeIcon = ({ name, className }) => {
  const Icon = Icons[name];
  return Icon ? <Icon className={className} /> : null;
};

// Loading Spinner Component
export const Spinner = ({ className }) => (
  <svg 
    className={cn("animate-spin h-5 w-5", className)} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


function App() {
  const screen = useKioskStore((state) => state.screen);
  const perfumeId = useKioskStore((state) => state.selectedPerfumeId);

  // Get theme styles from tailwind-variants
  const { base } = kioskTheme({ perfume: perfumeId || 'default' });

  // Simple router based on state
  const renderScreen = () => {
    switch (screen) {
      case 'SELECT':
        return <SelectionScreen />;
      case 'PAYMENT':
        return <PaymentScreen />;
      case 'DISPENSE':
        return <DispenseScreen />;
      case 'COMPLETE':
        return <CompleteScreen />;
      default:
        return <SelectionScreen />;
    }
  };

  return (
    <main className={cn("flex justify-center items-center min-h-screen", base())}>
      <div className="w-full max-w-md p-6 sm:p-8">
        {renderScreen()}
      </div>
    </main>
  );
}

export default App;