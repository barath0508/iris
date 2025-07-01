import { Flower2 } from 'lucide-react';

export function Header() {
  return (
    <header className="py-12 text-center">
      <div className="container mx-auto px-4">
        <div className="inline-flex items-center gap-3">
          <Flower2 className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            IrisVision
          </h1>
        </div>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover the species of an Iris flower based on its measurements.
        </p>
      </div>
    </header>
  );
}
