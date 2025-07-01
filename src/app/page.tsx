'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { IrisInputForm, type IrisFormValues } from '@/components/iris-input-form';
import { PredictionDisplay } from '@/components/prediction-display';
import { predictIris, type IrisSpecies } from '@/lib/prediction';
import { analyzePrediction } from '@/ai/flows/analyze-prediction';
import { Card, CardContent } from '@/components/ui/card';
import { Flower, Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

type PredictionResult = {
  species: IrisSpecies;
  explanation: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const handlePredict = async (values: IrisFormValues) => {
    setLoading(true);
    setPrediction(null);
    try {
      const species = predictIris(
        values.sepalLength,
        values.sepalWidth,
        values.petalLength,
        values.petalWidth
      );

      const analysis = await analyzePrediction({
        ...values,
        prediction: species,
      });

      setPrediction({
        species,
        explanation: analysis.explanation,
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to analyze the flower prediction. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <IrisInputForm onSubmit={handlePredict} onLoadingChange={setLoading} isLoading={loading} />
          <div className="lg:sticky top-8">
            {loading ? (
              <Card className="flex items-center justify-center p-16 h-[550px] animate-in fade-in duration-500">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg">Analyzing...</p>
                </div>
              </Card>
            ) : prediction ? (
              <PredictionDisplay result={prediction} />
            ) : (
              <Card className="flex items-center justify-center p-8 h-[550px] border-dashed animate-in fade-in duration-500">
                <div className="text-center text-muted-foreground">
                  <Flower className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Awaiting your flower's details</h3>
                  <p>Enter the measurements in the form to predict the Iris species.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
