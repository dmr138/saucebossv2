
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Utensils, Droplets, Scale, FlaskConical, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

const MIN_CHEESE_MASS = 100; // grams
const MAX_CHEESE_MASS = 2000; // grams
const CHEESE_MASS_STEP = 1; // Changed from 10 to 1
const DEFAULT_CHEESE_MASS = 500;

const MIN_WATER_RATIO = 10; // percent based on cheese mass
const MAX_WATER_RATIO = 100; // percent
const WATER_RATIO_STEP = 1;
const DEFAULT_WATER_RATIO = 30;

const CheeseWedgeIcon = ({ className: propClassName }: { className?: string }) => (
  <svg
    className={cn("h-6 w-6 mb-1", propClassName)}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 20L9.5 6.5Q12 4 14.5 6.5L21 20H3Z" fill="#FFB74D" stroke="#FB8C00" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="13.5" r="1.2" fill="#FFE0B2" stroke="none"/>
    <circle cx="10" cy="17" r="1.5" fill="#FFE0B2" stroke="none"/>
    <circle cx="12" cy="11" r="0.9" fill="#FFE0B2" stroke="none"/>
    <circle cx="15" cy="14.5" r="1.1" fill="#FFE0B2" stroke="none"/>
    <circle cx="18" cy="12.5" r="0.8" fill="#FFE0B2" stroke="none"/>
  </svg>
);


export function CheeseCalculator() {
  const [cheeseMass, setCheeseMass] = useState<number>(DEFAULT_CHEESE_MASS);
  const [waterRatio, setWaterRatio] = useState<number>(DEFAULT_WATER_RATIO);
  const [waterAmount, setWaterAmount] = useState<number>(0);
  const [citrateAmount, setCitrateAmount] = useState<number>(0);

  useEffect(() => {
    const calculatedWater = (cheeseMass / 100) * waterRatio;
    const totalMass = cheeseMass + calculatedWater;
    const calculatedCitrate = (totalMass / 100) * 2.5;

    setWaterAmount(Math.round(calculatedWater));
    setCitrateAmount(Math.round(calculatedCitrate * 100) / 100);
  }, [cheeseMass, waterRatio]);

  return (
    <Card className="w-full max-w-md shadow-xl rounded-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
            <Utensils className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline">
          SauceBoss
        </CardTitle>
        <CardDescription className="text-sm">
          Perfect sodium citrate cheese sauce, every time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-start gap-4">
              <Label htmlFor="cheeseMassSlider" className="text-base font-medium flex items-center gap-2">
                <Scale className="h-5 w-5 text-accent" />
                Cheese Mass:
              </Label>
              <div className="flex items-center gap-1">
                <span className="font-bold text-primary tabular-nums">{cheeseMass}g</span>
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-primary"
                    onClick={() => setCheeseMass(prev => Math.min(MAX_CHEESE_MASS, prev + CHEESE_MASS_STEP))}
                    aria-label="Increase cheese mass"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-primary mt-[-0.5rem]"
                    onClick={() => setCheeseMass(prev => Math.max(MIN_CHEESE_MASS, prev - CHEESE_MASS_STEP))}
                    aria-label="Decrease cheese mass"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <Slider
              id="cheeseMassSlider"
              min={MIN_CHEESE_MASS}
              max={MAX_CHEESE_MASS}
              step={CHEESE_MASS_STEP}
              value={[cheeseMass]}
              onValueChange={(value) => setCheeseMass(value[0])}
              aria-label="Cheese Mass Slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{MIN_CHEESE_MASS}g</span>
              <span>{MAX_CHEESE_MASS}g</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-start gap-4">
              <Label htmlFor="waterRatioSlider" className="text-base font-medium flex items-center gap-2">
                <Droplets className="h-5 w-5 text-accent" />
                Water Ratio (to cheese):
              </Label>
              <div className="flex items-center gap-1">
                <span className="font-bold text-primary tabular-nums">{waterRatio}%</span>
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-primary"
                    onClick={() => setWaterRatio(prev => Math.min(MAX_WATER_RATIO, prev + WATER_RATIO_STEP))}
                    aria-label="Increase water ratio"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-primary mt-[-0.5rem]"
                    onClick={() => setWaterRatio(prev => Math.max(MIN_WATER_RATIO, prev - WATER_RATIO_STEP))}
                    aria-label="Decrease water ratio"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <Slider
              id="waterRatioSlider"
              min={MIN_WATER_RATIO}
              max={MAX_WATER_RATIO}
              step={WATER_RATIO_STEP}
              value={[waterRatio]}
              onValueChange={(value) => setWaterRatio(value[0])}
              aria-label="Water to Cheese Ratio Slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{MIN_WATER_RATIO}%</span>
              <span>{MAX_WATER_RATIO}%</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-headline text-center">Your Recipe:</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-muted/50 rounded-md shadow-inner flex flex-col items-center">
              <CheeseWedgeIcon />
              <p className="text-xs sm:text-sm text-muted-foreground">Cheese</p>
              <p className="text-xl sm:text-2xl font-bold text-primary tabular-nums">{cheeseMass}g</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md shadow-inner flex flex-col items-center">
              <Droplets className="h-6 w-6 mb-1 text-blue-500" />
              <p className="text-xs sm:text-sm text-muted-foreground">Water</p>
              <p className="text-xl sm:text-2xl font-bold text-primary tabular-nums">{waterAmount}g</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md shadow-inner flex flex-col items-center">
              <FlaskConical className="h-6 w-6 mb-1 text-white" />
              <p className="text-xs sm:text-sm text-muted-foreground">Sodium Citrate</p>
              <p className="text-xl sm:text-2xl font-bold text-primary tabular-nums">{citrateAmount}g</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <p className="text-xs text-muted-foreground text-center w-full">
            Adjust sliders to see real-time calculations. Sodium citrate is calculated at 2.5% of the total mass (cheese + water).
        </p>
      </CardFooter>
    </Card>
  );
}

