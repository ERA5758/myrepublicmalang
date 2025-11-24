'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { ArrowRight, Loader, Mail, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { captureLead } from '@/lib/actions';
import { type LeadCaptureFormState } from '@/lib/definitions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CoverageMap } from '@/components/coverage-map';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ArrowRight className="mr-2 h-4 w-4" />
      )}
      Submit Application
    </Button>
  );
}

export default function RegisterPage() {
  const initialState: LeadCaptureFormState = null;
  const [state, dispatch] = useFormState(captureLead, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && !state.fields) {
      toast({
        title: state.message.startsWith('Thank you') ? 'Success!' : 'Uh oh!',
        description: state.message,
        variant: state.message.startsWith('Thank you') ? 'default' : 'destructive',
      });
      if(state.message.startsWith('Thank you')) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto max-w-7xl py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Join the Revolution</h1>
          <p className="text-xl text-muted-foreground">
            You're one step away from experiencing the fastest internet in Malang. Fill out the form to get started, and we'll handle the rest.
          </p>
          <div className="space-y-4">
            <h2 className="font-headline text-2xl font-semibold">Our Coverage Area</h2>
            <p className="text-muted-foreground">
              Check out our current service area in Malang. We are expanding rapidly, so check back often if your area isn't covered yet!
            </p>
            <CoverageMap />
          </div>
        </div>
        <Card className="w-full max-w-lg justify-self-center lg:justify-self-end">
          <CardHeader>
            <CardTitle>Register Your Interest</CardTitle>
            <CardDescription>
              Submit your details, and our team will contact you for installation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" placeholder="e.g. Budi Santoso" required className="pl-10" />
                </div>
                {state?.fields?.name && <p className="text-sm text-destructive">{state.fields.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required className="pl-10" />
                </div>
                 {state?.fields?.email && <p className="text-sm text-destructive">{state.fields.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" name="phone" type="tel" placeholder="081234567890" required className="pl-10" />
                </div>
                {state?.fields?.phone && <p className="text-sm text-destructive">{state.fields.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Full Installation Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="address" name="address" placeholder="e.g. Jl. Ijen No. 25, Malang" required className="pl-10" />
                </div>
                {state?.fields?.address && <p className="text-sm text-destructive">{state.fields.address}</p>}
              </div>

              {state?.issues && state.issues.map(issue => <p key={issue} className="text-sm text-destructive">{issue}</p>)}
              
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
