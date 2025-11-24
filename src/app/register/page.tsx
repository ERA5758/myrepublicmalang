'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowRight, Loader, Mail, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { captureLead } from '@/lib/actions';
import { type LeadCaptureFormState } from '@/lib/definitions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/data';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ArrowRight className="mr-2 h-4 w-4" />
      )}
      Kirim Pendaftaran
    </Button>
  );
}

export default function RegisterPage() {
  const initialState: LeadCaptureFormState = null;
  const [state, dispatch] = useActionState(captureLead, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && !state.fields) {
      toast({
        title: state.message.startsWith('Terima kasih') ? 'Sukses!' : 'Uh oh!',
        description: state.message,
        variant: state.message.startsWith('Terima kasih') ? 'default' : 'destructive',
      });
      if(state.message.startsWith('Terima kasih')) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto max-w-7xl py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Bergabunglah dengan Revolusi</h1>
          <p className="text-xl text-muted-foreground">
            Anda selangkah lagi untuk merasakan internet tercepat di Malang. Isi formulir untuk memulai, dan kami akan menangani sisanya.
          </p>
           <div className="space-y-4">
            <h2 className="font-headline text-2xl font-semibold">Belum Yakin?</h2>
            <p className="text-muted-foreground">
              Lihat daftar lengkap <Link href="/coverage-areas" className="text-primary hover:underline">area jangkauan</Link> kami atau lihat pertanyaan yang sering diajukan di bawah ini.
            </p>
             <Accordion type="single" collapsible className="w-full">
              {faqs.slice(0,3).map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <Card className="w-full max-w-lg justify-self-center lg:justify-self-end">
          <CardHeader>
            <CardTitle>Daftarkan Minat Anda</CardTitle>
            <CardDescription>
              Kirim detail Anda, dan tim kami akan menghubungi Anda untuk instalasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={dispatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" placeholder="cth. Budi Santoso" required className="pl-10" />
                </div>
                {state?.fields?.name && <p className="text-sm text-destructive">{state.fields.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="anda@contoh.com" required className="pl-10" />
                </div>
                 {state?.fields?.email && <p className="text-sm text-destructive">{state.fields.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" name="phone" type="tel" placeholder="081234567890" required className="pl-10" />
                </div>
                {state?.fields?.phone && <p className="text-sm text-destructive">{state.fields.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Instalasi Lengkap</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="address" name="address" placeholder="cth. Jl. Ijen No. 25, Malang" required className="pl-10" />
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
