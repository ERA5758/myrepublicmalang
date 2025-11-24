'use server';

import { getWhatsappSettings } from '@/lib/server/whatsapp-settings';

async function internalSendWhatsapp(deviceId: string, target: string, message: string, isGroup: boolean = false) {
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

        if (!response.ok) {
            const responseJson = await response.json().catch(() => ({}));
            console.error('WhaCenter API HTTP Error:', { status: response.status, body: responseJson });
        } else {
            const responseJson = await response.json();
            if (responseJson.status === 'error') {
                console.error('WhaCenter API Error:', responseJson.reason);
            } else {
                console.log('WhatsApp notification sent successfully.');
            }
        }
    } catch (error) {
        console.error("Failed to send WhatsApp message:", error);
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
    address: string;
    selectedPlan: string;
    locationPin?: string;
}

export async function sendLeadNotification(lead: LeadData) {
    const settings = await getWhatsappSettings();

    if (!settings.deviceId || !settings.targetNumber) {
        console.error("WhatsApp settings (Device ID or Target Number) are not configured in environment variables.");
        return;
    }

    const message = `
*🔔 Prospek Baru MyRepublic Malang!*

Ada pendaftaran baru telah masuk melalui website.

*Detail Pelanggan:*
- *Nama:* ${lead.name}
- *No. Telepon:* ${lead.phone}
- *Email:* ${lead.email}
- *Alamat:* ${lead.address}
- *Paket Dipilih:* ${lead.selectedPlan}
${lead.locationPin ? `- *Koordinat GPS:* https://www.google.com/maps?q=${lead.locationPin}` : ''}

Harap segera tindak lanjuti.
    `.trim();

    const formattedTarget = formatWhatsappNumber(settings.targetNumber);

    await internalSendWhatsapp(settings.deviceId, formattedTarget, message);
}
