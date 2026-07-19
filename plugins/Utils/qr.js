import QRCode from 'qrcode';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'qr',
    alias: ['qrcode', 'qrgen'],
    description: 'Generate a QR code from text or link',
    run: async (context) => {
        const { client, m, text, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *QR CODE*\n━━━━━━━━━━━━━━━━\nUsage: ${prefix}qr <text or link>\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const dataUrl = await QRCode.toDataURL(text.slice(0, 2000), { scale: 8, errorCorrectionLevel: 'H' });
            const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
            const imgBuffer = Buffer.from(base64, 'base64');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: imgBuffer,
                caption: `📌 *QR CODE*\n━━━━━━━━━━━━━━━━\nScan with any QR reader.\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            sendInteractive(client, m, 'Failed to generate QR code.');
        }
    }
};
