
import { CheeseCalculator } from '@/components/calculator/cheese-calculator';
import { Header } from '@/components/layout/header';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4">
        <CheeseCalculator />
      </main>
      <footer className="py-1 text-center text-xs text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} SauceBoss. All rights reserved.</p>
        <p className="font-mono text-xs mt-0.5">Crafted for cheese lovers.</p>
      </footer>
    </div>
  );
}
