'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { IrisSpecies } from '@/lib/prediction';

interface PredictionDisplayProps {
  result: {
    species: IrisSpecies;
    explanation: string;
    imageDataUri: string;
  };
}

const speciesDetails: Record<IrisSpecies, { name: string; hint: string }> = {
  setosa: {
    name: 'Iris Setosa',
    hint: 'iris setosa',
  },
  versicolor: {
    name: 'Iris Versicolor',
    hint: 'iris versicolor',
  },
  virginica: {
    name: 'Iris Virginica',
    hint: 'iris virginica',
  },
};

export function PredictionDisplay({ result }: PredictionDisplayProps) {
  const details = speciesDetails[result.species];

  return (
    <Card className="shadow-lg animate-in fade-in-0 zoom-in-95 duration-500">
      <CardHeader>
        <CardDescription>Prediction Result</CardDescription>
        <CardTitle className="flex items-center gap-4">
          <span>{details.name}</span>
          <Badge variant="secondary" className="bg-accent text-accent-foreground capitalize">{result.species}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full mb-6 rounded-lg overflow-hidden">
          <Image
            src={result.imageDataUri}
            alt={`Image of ${details.name}`}
            fill
            className="object-cover"
            data-ai-hint={details.hint}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
          <p className="text-muted-foreground bg-accent/50 p-4 rounded-md border border-accent">
            {result.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
