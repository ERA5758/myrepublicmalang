
'use server';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { offers, offersTV, addOns, carouselSlides, myGamerPackages, parallelPackages } from './blog-data';
import type { SpeedRoastTemplate } from './definitions';

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
    return seedCollection('myGamerPackages', myGamerPackages);
}

export async function seedParallelPackages() {
    return seedCollection('parallelPackages', parallelPackages);
}

export async function seedSpeedRoastTemplates() {
    const templates: SpeedRoastTemplate[] = [
        {
            id: 'siput-1',
            category: 'siput',
            roast: 'Waduh! Internetmu di [CITY] cuma [SPEED] Mbps? Apa ini obat tidur? Lemot banget! Ngetik "P" di WhatsApp aja nunggunya kayak nunggu hilal. Pantesan tadi tap roketmu banyak yang sia-sia!',
            diagnosis: 'Terdeteksi gejala anemia jaringan kronis.',
            action: 'Segera donor bandwidth dari MyRepublic.'
        },
        {
            id: 'siput-2',
            category: 'siput',
            roast: 'Koneksi siput [SPEED] Mbps begini kok masih dipelihara warga [CITY]? Download drama Korea satu episode aja bisa ganti presiden. Kasihan roketnya gak meluncur-meluncur!',
            diagnosis: 'Kapasitas kabel sudah mencapai batas kesabaran manusia.',
            action: 'Ganti ke MyRepublic biar hidup lebih berwarna.'
        },
        {
            id: 'kurakura-1',
            category: 'kurakura',
            roast: 'Lumayan sih dapet [SPEED] Mbps di [CITY], tapi kalau dipake mabar sekeluarga langsung rebutan bandwidth kayak antre sembako. Roketmu meluncur tapi oleng ditiup angin!',
            diagnosis: 'Rasio upload dan download yang tidak seimbang.',
            action: 'Butuh koneksi simetris 1:1 MyRepublic.'
        },
        {
            id: 'kurakura-2',
            category: 'kurakura',
            roast: 'Kecepatan [SPEED] Mbps di [CITY] emang cukup buat scroll TikTok, tapi buat upload konten? Bisa ditinggal tidur siang dulu. Kecepatan nanggung bikin darah tinggi naik pelan-pelan.',
            diagnosis: 'Terkena kutukan asimetris provider lama.',
            action: 'Pindah ke paket Neo MyRepublic.'
        },
        {
            id: 'kelinci-1',
            category: 'kelinci',
            roast: 'Wah, warga [CITY] satu ini dapet [SPEED] Mbps, stabil sih. Tapi yakin kuotanya nggak kena FUP di akhir bulan? Jangan mau diphp-in provider lama yang ngakunya unlimited tapi bohong!',
            diagnosis: 'Potensi kecepatan tinggi yang dibatasi aturan FUP kaku.',
            action: 'Jadilah bebas tanpa batas dengan MyRepublic.'
        }
    ];
    return seedCollection('speedRoastTemplates', templates);
}
