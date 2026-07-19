import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sendInteractive } from '../../lib/sendInteractive.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const normalizeNumber = (jid) => {
    if (!jid) return '';
    return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const DEVELOPER = normalizeNumber('255767862457');
const FEATURES_DIR = path.join(__dirname, '..', '..', 'features');

export default async (context) => {
    const { client, m, text, prefix } = context;
    await client.sendMessage(m.chat, { react: { text: '🔍', key: m.reactKey } });

    if (normalizeNumber(m.sender) !== DEVELOPER) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        return await sendInteractive(client, m, `🚫 *ACCESS DENIED*\n━━━━━━━━━━━━━━━━\nThis command is restricted to the bot owner.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    if (!text) {
        let files = [];
        try { const entries = await fs.readdir(FEATURES_DIR); files = entries.filter(f => f.endsWith('.js')); } catch {}
        const fileList = files.map(f => `• ${f.replace('.js', '')}`).join('\n');
        return await sendInteractive(client, m, `📌 *GETFUNC*\n━━━━━━━━━━━━━━━━\nUsage: ${prefix}getfunc <name>\nAvailable features:\n(none found)'}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    const funcName = text.trim().endsWith('.js') ? text.trim().slice(0, -3) : text.trim();
    const filePath = path.join(FEATURES_DIR, `${funcName}.js`);

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const fileBuffer = Buffer.from(data, 'utf8');

        await sendInteractive(client, m, `📌 *FEATURE FILE*\n━━━━━━━━━━━━━━━━\nFile: ${funcName}.js\nSize: ${data.length} chars\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        await client.sendMessage(m.chat, {
            document: fileBuffer,
            fileName: `${funcName}.js`,
            mimetype: 'application/javascript',
            caption: `📌 *GETFUNC*\n━━━━━━━━━━━━━━━━\n📄 ${funcName}.js\nFolder: features/\nSize: ${data.length} chars\n━━━━━━━━━━━━━━━━\n© bmb tech`
        });

    } catch (err) {
        if (err.code === 'ENOENT') {
            let files = [];
            try { const entries = await fs.readdir(FEATURES_DIR); files = entries.filter(f => f.endsWith('.js')); } catch {}
            const fileList = files.map(f => `• ${f.replace('.js', '')}`).join('\n');
            return await sendInteractive(client, m, `📌 *NOT FOUND*\n━━━━━━━━━━━━━━━━\n"${funcName}" not found in features/.\nAvailable:\n(none found)'}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        return await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nError reading file: ${err.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
