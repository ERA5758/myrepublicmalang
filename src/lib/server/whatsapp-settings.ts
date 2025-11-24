'use server';

export async function getWhatsappSettings() {
  const deviceId = process.env.WA_DEVICE_ID;
  const adminGroup = process.env.WHATSAPP_ADMIN_GROUP;

  return {
    deviceId,
    adminGroup,
  };
}
