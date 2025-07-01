'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { generateStarterPrompt } from '@/ai/flows/generate-starter-prompt';
import { useToast } from '@/hooks/use-toast';
import { Wand2, BrainCircuit } from 'lucide-react';

const formSchema = z.object({
  sepalLength: z.coerce.number().min(0.1, "Must be positive").max(10, "Too large"),
  sepalWidth: z.coerce.number().min(0.1, "Must be positive").max(10, "Too large"),
  petalLength: z.coerce.number().min(0.1, "Must be positive").max(10, "Too large"),
  petalWidth: z.coerce.number().min(0.1, "Must be positive").max(10, "Too large"),
});

export type IrisFormValues = z.infer<typeof formSchema>;

interface IrisInputFormProps {
  onSubmit: (values: IrisFormValues) => void;
  onLoadingChange: (loading: boolean) => void;
  isLoading: boolean;
}

export function IrisInputForm({ onSubmit, isLoading }: IrisInputFormProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<IrisFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sepalLength: 5.1,
      sepalWidth: 3.5,
      petalLength: 1.4,
      petalWidth: 0.2,
    },
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const starterPrompt = await generateStarterPrompt({});
      form.reset(starterPrompt);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate sample data. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const fieldDetails = [
    { name: 'sepalLength', label: 'Sepal Length (cm)', min: 0.1, max: 8, step: 0.1 },
    { name: 'sepalWidth', label: 'Sepal Width (cm)', min: 0.1, max: 5, step: 0.1 },
    { name: 'petalLength', label: 'Petal Length (cm)', min: 0.1, max: 7, step: 0.1 },
    { name: 'petalWidth', label: 'Petal Width (cm)', min: 0.1, max: 3, step: 0.1 },
  ] as const;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Flower Measurements</CardTitle>
        <CardDescription>Enter the dimensions of the Iris flower below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {fieldDetails.map((detail) => (
              <FormField
                key={detail.name}
                control={form.control}
                name={detail.name}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>{detail.label}</FormLabel>
                      <Input
                        type="number"
                        {...field}
                        className="w-24 h-9"
                        min={detail.min}
                        max={detail.max}
                        step={detail.step}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                        min={detail.min}
                        max={detail.max}
                        step={detail.step}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                <BrainCircuit className="mr-2 h-4 w-4" />
                {isLoading ? 'Predicting...' : 'Predict Species'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleGenerate} disabled={isGenerating || isLoading} className="w-full">
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Feeling Lucky?'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
