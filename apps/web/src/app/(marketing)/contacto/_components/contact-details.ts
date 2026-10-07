export const contactDetails = {
  email: 'hola@enveliastudio.com',
  whatsapp: 'https://wa.me/525512345678',
  phone: '+52 55 1234 5678',
  instagram: 'https://www.instagram.com/enveliastudio/',
  pinterest: 'https://www.pinterest.com/enveliastudio/',
  facebook: 'https://www.facebook.com/enveliastudio/',
} as const;

export function createContactMailto(name: string, email: string, topic: string, message: string) {
  const subject = `Envelia Studio — ${topic}`;
  const body = `Nombre: ${name.trim()}\nCorreo: ${email.trim()}\nAsunto: ${topic}\n\n${message.trim()}`;
  return `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
