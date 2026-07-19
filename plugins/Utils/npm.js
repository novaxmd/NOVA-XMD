import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'npminfo',
    aliases: ['npmpackage', 'npmlookup'],
    description: 'Look up an npm package',
    run: async (context) => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const pkg = (text || '').trim();
        if (!pkg) {
            return sendInteractive(client, m, `📌 *NPM*\n━━━━━━━━━━━━━━━━\nUsage: .npm express\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, { timeout: 8000 });
            const d = res.data;
            const latest = d['dist-tags']?.latest || '?';
            const desc = d.description || 'No description';
            const author = (typeof d.author === 'object' ? d.author?.name : d.author) || 'Unknown';
            const license = d.license || '?';
            const homepage = d.homepage || d.repository?.url || d['repository']?.url || '?';
            const weekly = d.downloads?.weekly || '?';
            const created = d.time?.created ? new Date(d.time.created).toLocaleDateString() : '?';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *NPM: ${D.NAME}*\n━━━━━━━━━━━━━━━━\n📦 Version: ${latest}\n📝 Desc: ${desc}\n👤 Author: ${author}\n📄 License: ${license}\n📅 Created: ${created}\n🔗 ${homepage}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *NPM*\n━━━━━━━━━━━━━━━━\nPackage "${pkg}" not found. Made it up?\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
