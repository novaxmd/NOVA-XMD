import fs from 'fs';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m, participants } = context;

    if (!m.isGroup) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nCommand meant for groups.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    try {
        const gcdata = await client.groupMetadata(m.chat);
        const vcard = gcdata.participants
            .map((a, i) => {
                const number = a.id.split('@')[0];
                return `BEGIN:VCARD\nVERSION:3.0\nFN:[${i}] +${number}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
            })
            .join('\n');

        const cont = './contacts.vcf';

        await sendInteractive(client, m, `📌 *VCF*\n━━━━━━━━━━━━━━━━\nA moment, NOVA-XMD is compiling\n${gcdata.participants.length} contacts into a VCF...\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        await fs.promises.writeFile(cont, vcard);
        await sendInteractive(client, m, `📌 *VCF*\n━━━━━━━━━━━━━━━━\nImport this VCF in a separate\nemail account to avoid messing\nwith your contacts...\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        await client.sendMessage(
            m.chat,
            {
                document: fs.readFileSync(cont),
                mimetype: 'text/vcard',
                fileName: 'Group contacts.vcf',
                caption: `📌 *VCF*\n━━━━━━━━━━━━━━━━\nVCF for ${gcdata.subject}\n${gcdata.participants.length} contacts\n━━━━━━━━━━━━━━━━\n© bmb tech`
            },
            { ephemeralExpiration: 86400 }
        );

        await fs.promises.unlink(cont);
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error(`VCF error: ${error.message}`);
        await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to generate VCF.\nTry again later.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
