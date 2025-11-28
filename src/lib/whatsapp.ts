
'use server';

import { getWhatsappSettings } from '@/lib/server/whatsapp-settings';

async function internalSendWhatsapp(deviceId: string, target: string, message: string, isGroup: boolean = false) {
    if (!deviceId || !target) {
        console.error("WhatsApp Device ID atau Target tidak tersedia. Pengiriman dibatalkan.");
        return;
    }

    const formData = new FormData();
    formData.append('device_id', deviceId);
    formData.append(isGroup ? 'group' : 'number', target);
    formData.append('message', message);
    const endpoint = isGroup ? 'sendGroup' : 'send';
    const webhookUrl = `https://app.whacenter.com/api/${endpoint}`;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
        });

        const responseText = await response.text();
        if (!response.ok) {
            console.error('WhaCenter API HTTP Error:', { status: response.status, body: responseText });
            return;
        }

        const responseJson = JSON.parse(responseText);
        if (responseJson.status === 'error') {
            console.error('WhaCenter API Error:', { target, reason: responseJson.reason });
        } else {
            console.log(`Pesan WhatsApp berhasil dikirim ke ${target}.`);
        }
    } catch (error) {
        console.error(`Gagal mengirim pesan WhatsApp ke ${target}:`, error);
    }
}

function formatWhatsappNumber(nomor: string | number): string {
    if (!nomor) return '';
    let nomorStr = String(nomor).replace(/\D/g, '');
    if (nomorStr.startsWith('0')) {
        return '62' + nomorStr.substring(1);
    }
    if (nomorStr.startsWith('8')) {
        return '62' + nomorStr;
    }
    return nomorStr;
}

type LeadData = {
    name: string;
    email: string;
    phone: string;
    area: string;
    address: string;
    selectedPlan: string;
    locationPin?: string;
    promo_prepaid?: string;
    promo_pos?: string;
}

export async function sendLeadNotification(lead: LeadData) {
    const settings = await getWhatsappSettings();

    if (!settings.deviceId) {
        console.error("WhatsApp Device ID tidak dikonfigurasi di environment variables.");
        return;
    }

    const selectedPromos = [
        lead.promo_prepaid,
        lead.promo_pos,
    ].filter(Boolean); // Filter out undefined/empty values

    let promoText = '';
    if (selectedPromos.length > 0) {
        promoText = `
*Promo yang Dipilih:*
${selectedPromos.map(p => `- ${p}`).join('\n')}`;
    }

    // Pesan untuk grup admin
    if (settings.adminGroup) {
        const adminMessage = `
*🔔 Prospek Baru MyRepublic Malang!*

Ada pendaftaran baru telah masuk melalui website.

*Detail Pelanggan:*
- *Nama:* ${lead.name}
- *No. Telepon:* ${lead.phone}
- *Email:* ${lead.email}
- *Area/Kelurahan:* ${lead.area}
- *Alamat Lengkap:* ${lead.address}
- *Paket Dipilih:* ${lead.selectedPlan}
${lead.locationPin ? `- *Koordinat GPS:* https://www.google.com/maps?q=${lead.locationPin}` : ''}
${promoText}

Harap segera tindak lanjuti.
        `.trim();
        await internalSendWhatsapp(settings.deviceId, settings.adminGroup, adminMessage, true);
    } else {
        console.warn("WHATSAPP_ADMIN_GROUP (ID Grup Admin) tidak diatur. Notifikasi ke admin dilewati.");
    }
    
    // Pesan konfirmasi untuk pelanggan
    const customerNumber = formatWhatsappNumber(lead.phone);
    if (customerNumber) {
        const customerMessage = `
Halo ${lead.name},

Terima kasih telah mendaftar di MyRepublic Malang! Kami telah menerima data pendaftaran Anda untuk paket *${lead.selectedPlan}*.

Tim kami akan segera menghubungi Anda untuk proses verifikasi dan penjadwalan instalasi.

Salam hangat,
Tim MyRepublic Malang
        `.trim();
        await internalSendWhatsapp(settings.deviceId, customerNumber, customerMessage, false);
    } else {
        console.warn(`Nomor telepon pelanggan tidak valid, notifikasi ke pelanggan dilewati: ${lead.phone}`);
    }
}
