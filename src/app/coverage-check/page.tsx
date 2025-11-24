import { CoverageMap } from '@/components/coverage-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CoverageCheckPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Check Our Coverage</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Use the interactive map to see our fiber network coverage across Malang. We're growing every day!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Malang Service Area</CardTitle>
          <CardDescription>The highlighted area shows where MyRepublic fiber internet is currently available. You can enter your address below to check, though this is for demonstration purposes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Enter your address to check</Label>
            <Input id="address" name="address" placeholder="e.g. Jl. Soekarno Hatta, Malang" />
          </div>
          <CoverageMap />
        </CardContent>
      </Card>
    </div>
  );
}
