'use server';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { offers, offersTV, addOns, carouselSlides, myGamerPackages } from './blog-data';

async function seedCollection(collectionName: string, data: any[]) {
    const { firestore } = initializeFirebase();
    if (!firestore) {
        throw new Error('Firestore is not initialized.');
    }

    const collectionRef = collection(firestore, collectionName);
    
    // Clear existing documents
    const querySnapshot = await getDocs(collectionRef);
    if (!querySnapshot.empty) {
        const deleteBatch = writeBatch(firestore);
        querySnapshot.forEach(doc => {
            deleteBatch.delete(doc.ref);
        });
        await deleteBatch.commit();
    }

    // Add new documents
    const addBatch = writeBatch(firestore);
    data.forEach(item => {
        const docRef = doc(collectionRef, item.id);
        addBatch.set(docRef, item);
    });
    
    await addBatch.commit();

    return data.length;
}

export async function seedOffers() {
    return seedCollection('offers', offers);
}

export async function seedOffersTV() {
    return seedCollection('offersTV', offersTV);
}

export async function seedAddOns() {
    return seedCollection('addOns', addOns);
}

export async function seedCarouselSlides() {
    return seedCollection('carouselSlides', carouselSlides);
}

export async function seedMyGamerPackages() {
    // Correcting the broken image URL before seeding
    const correctedMyGamerPackages = myGamerPackages.map(pkg => {
        if (pkg.id === 'mygamer-platinum') {
            return {
                ...pkg,
                image: {
                    id: 'gamerplatinum',
                    imageUrl: 'https://picsum.photos/seed/gamerplatinum/800/600',
                    description: 'MyGamer Platinum Package',
                    imageHint: 'gamer platinum'
                }
            };
        }
        return pkg;
    });
    return seedCollection('myGamerPackages', correctedMyGamerPackages);
}
