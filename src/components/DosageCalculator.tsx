import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, User, Weight, Pill, Clock, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CalculationResult {
  dosePerAdministration: number;
  volumeToAdminister?: number;
  tabletsRequired?: number;
  dailyTotalDose: number;
  safetyWarning?: string;
}

export default function DosageCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [medicationStrength, setMedicationStrength] = useState("");
  const [medicationType, setMedicationType] = useState<"liquid" | "tablet">("liquid");
  const [prescribedDose, setPrescribedDose] = useState("");
  const [doseType, setDoseType] = useState<"per_kg" | "fixed">("per_kg");
  const [frequency, setFrequency] = useState("8");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const resetForm = () => {
    setAge("");
    setWeight("");
    setWeightUnit("kg");
    setMedicationStrength("");
    setMedicationType("liquid");
    setPrescribedDose("");
    setDoseType("per_kg");
    setFrequency("8");
    setResult(null);
  };

  const calculateDosage = () => {
    const weightInKg = weightUnit === "kg" ? parseFloat(weight) : parseFloat(weight) * 0.453592;
    const strength = parseFloat(medicationStrength);
    const dose = parseFloat(prescribedDose);
    const hoursPerDay = 24;
    const dosesPerDay = hoursPerDay / parseFloat(frequency);

    if (!weightInKg || !strength || !dose) {
      return;
    }

    const dosePerAdministration = doseType === "per_kg" ? dose * weightInKg : dose;
    const dailyTotalDose = dosePerAdministration * dosesPerDay;

    let calculation: CalculationResult = {
      dosePerAdministration,
      dailyTotalDose,
    };

    if (medicationType === "liquid") {
      calculation.volumeToAdminister = dosePerAdministration / strength;
    } else {
      calculation.tabletsRequired = Math.ceil(dosePerAdministration / strength);
    }

    // Safety check (example: if daily dose exceeds 3000mg, show warning)
    const maxSafeDailyDose = 3000;
    if (dailyTotalDose > maxSafeDailyDose) {
      calculation.safetyWarning = `Daily dose (${dailyTotalDose.toFixed(2)}mg) exceeds recommended limit (${maxSafeDailyDose}mg). Please consult with a physician.`;
    }

    setResult(calculation);
  };

  const isFormValid = age && weight && medicationStrength && prescribedDose;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-gradient-medical p-4">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">Medicine Dosage Calculator</h1>
          <p className="text-lg text-muted-foreground">Calculate accurate medication dosages for safe administration</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card transition-shadow hover:shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Patient Information
              </CardTitle>
              <CardDescription>Enter patient details for dosage calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter patient age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="0"
                    step="0.1"
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-shadow hover:shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-secondary" />
                Medication Details
              </CardTitle>
              <CardDescription>Specify medication strength and type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicationType">Medication Form</Label>
                <Select value={medicationType} onValueChange={(value: "liquid" | "tablet") => setMedicationType(value)}>
                  <SelectTrigger id="medicationType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="liquid">Liquid (mg/mL)</SelectItem>
                    <SelectItem value="tablet">Tablet (mg/tablet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strength">Medication Strength ({medicationType === "liquid" ? "mg/mL" : "mg/tablet"})</Label>
                <Input
                  id="strength"
                  type="number"
                  placeholder="Enter medication strength"
                  value={medicationStrength}
                  onChange={(e) => setMedicationStrength(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-shadow hover:shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5 text-accent" />
                Prescription Details
              </CardTitle>
              <CardDescription>Enter prescribed dosage information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doseType">Dosage Type</Label>
                <Select value={doseType} onValueChange={(value: "per_kg" | "fixed") => setDoseType(value)}>
                  <SelectTrigger id="doseType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_kg">Per kg body weight (mg/kg)</SelectItem>
                    <SelectItem value="fixed">Fixed dose (mg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dose">Prescribed Dose ({doseType === "per_kg" ? "mg/kg" : "mg"})</Label>
                <Input
                  id="dose"
                  type="number"
                  placeholder="Enter prescribed dose"
                  value={prescribedDose}
                  onChange={(e) => setPrescribedDose(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-shadow hover:shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Administration Frequency
              </CardTitle>
              <CardDescription>How often should the medication be given?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Every (hours)</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">Every 4 hours</SelectItem>
                    <SelectItem value="6">Every 6 hours</SelectItem>
                    <SelectItem value="8">Every 8 hours</SelectItem>
                    <SelectItem value="12">Every 12 hours</SelectItem>
                    <SelectItem value="24">Once daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={calculateDosage} disabled={!isFormValid} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Button>
                <Button onClick={resetForm} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card className="mt-6 border-2 border-primary shadow-elevated animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="h-6 w-6 text-success" />
                Calculation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Dose per Administration</p>
                  <p className="text-3xl font-bold text-primary">{result.dosePerAdministration.toFixed(2)} mg</p>
                </div>

                {result.volumeToAdminister && (
                  <div className="rounded-lg bg-secondary/10 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Volume to Administer</p>
                    <p className="text-3xl font-bold text-secondary">{result.volumeToAdminister.toFixed(2)} mL</p>
                  </div>
                )}

                {result.tabletsRequired && (
                  <div className="rounded-lg bg-secondary/10 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Tablets Required</p>
                    <p className="text-3xl font-bold text-secondary">{result.tabletsRequired} tablet(s)</p>
                  </div>
                )}

                <div className="rounded-lg bg-accent/10 p-4">
                  <p className="text-sm font-medium text-muted-foreground">Daily Total Dose</p>
                  <p className="text-3xl font-bold text-accent">{result.dailyTotalDose.toFixed(2)} mg</p>
                </div>
              </div>

              {result.safetyWarning && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{result.safetyWarning}</AlertDescription>
                </Alert>
              )}

              <Alert className="bg-blue-50 dark:bg-blue-950 border-primary">
                <AlertDescription className="text-sm">
                  <strong>Note:</strong> This calculator is for educational purposes. Always verify calculations with a qualified healthcare professional before administering medication.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
