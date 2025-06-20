
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-12 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-headline font-semibold text-primary">
          SauceBoss
        </h1>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
