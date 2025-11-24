'use server';

export function getWhatsappSettings() {
  const deviceId = process.env.WA_DEVICE_ID;
  const targetNumber = process.env.WA_TARGET_NUMBER;

  return {
    deviceId,
    targetNumber,
  };
}
