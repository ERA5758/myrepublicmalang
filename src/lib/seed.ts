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
            roast: 'Masih jaman pake [CONN] di [CITY] yang speed-nya cuma [SPEED] Mbps? Pantesan tadi [TAPS] tap roketmu gak gerak. Itu internet apa siput lagi kena stroke? Ngetik "P" di WhatsApp aja nunggunya kayak nunggu hilal!',
            diagnosis: 'Terdeteksi gejala anemia jaringan kronis pada [CONN].',
            action: 'Segera donor bandwidth simetris dari MyRepublic.'
        },
        {
            id: 'siput-2',
            category: 'siput',
            roast: 'Waduh, warga [CITY] satu ini saking sabarnya sampe betah pake [CONN] lemot [SPEED] Mbps. Download drama Korea satu episode aja bisa ganti presiden. Kasihan roketnya gak meluncur-meluncur meski sudah kamu pompa [TAPS] kali!',
            diagnosis: 'Kapasitas [CONN] sudah mencapai batas kesabaran manusia.',
            action: 'Ganti ke MyRepublic biar hidup lebih berwarna.'
        },
        {
            id: 'kurakura-1',
            category: 'kurakura',
            roast: 'Lumayan sih dapet [SPEED] Mbps pake [CONN] di [CITY], tapi kalau dipake mabar sekeluarga langsung rebutan bandwidth kayak antre sembako. Tadi kamu nge-tap [TAPS] kali roketnya meluncur tapi oleng ditiup angin karena upload-nya pelit!',
            diagnosis: 'Rasio upload dan download [CONN] yang tidak seimbang (Asimetris).',
            action: 'Butuh koneksi simetris 1:1 MyRepublic.'
        },
        {
            id: 'kurakura-2',
            category: 'kurakura',
            roast: 'Kecepatan [SPEED] Mbps di [CITY] emang cukup buat scroll TikTok, tapi buat upload konten pake [CONN] ini? Bisa ditinggal tidur siang dulu. Capek-capek nge-tap [TAPS] kali tapi speed nanggung bikin darah tinggi naik pelan-pelan.',
            diagnosis: 'Terkena kutukan asimetris provider [CONN] lama.',
            action: 'Pindah ke paket Neo MyRepublic (Double Speed!).'
        },
        {
            id: 'kelinci-1',
            category: 'kelinci',
            roast: 'Wah, [CONN] di [CITY] tembus [SPEED] Mbps, stabil sih. Tapi yakin kuotanya nggak kena FUP di akhir bulan? Kamu punya refleks dewa dengan [TAPS] taps, jangan mau diphp-in provider lama yang ngakunya unlimited tapi bohong!',
            diagnosis: 'Potensi kecepatan tinggi [CONN] yang dibatasi aturan FUP kaku.',
            action: 'Jadilah bebas tanpa batas dengan MyRepublic.'
        }
    ];
    return seedCollection('speedRoastTemplates', templates);
}