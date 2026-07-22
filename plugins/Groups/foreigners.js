import middleware from '../../utils/botUtil/middleware.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, args, participants, mycode } = context;
        const fq = m;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const resolveParticipantJid = (p) => {
            if (p.pn) return String(p.pn).replace(/\D/g, '') + '@s.whatsapp.net';
            const base = p.jid || p.id || '';
            if (base && !base.endsWith('@lid')) return base.split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
            return resolveTargetJid(base, participants) || base;
        };

        const botJid = client.decodeJid(client.user.id);
        const foreignList = participants
            .filter(p => !p.admin)
            .map(p => resolveParticipantJid(p))
            .filter(jid => jid && !jid.startsWith(mycode) && jid !== botJid && jid !== client.decodeJid(client.user.id));

        if (!args || !args[0]) {
            if (foreignList.length === 0) {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return sendInteractive(client, m, `📌 *FOREIGNERS*\n━━━━━━━━━━━━━━━━\nNo foreigners detected. Group is clean, for now.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
            let txt = `🌍 *FOREIGNERS*\n━━━━━━━━━━━━━━━━\nCountry code not matching: ${mycode}\nFound ${foreignList.length} unwanted guests:\n\n`;
            for (const jid of foreignList) txt += `@${jid.split('@')[0]}\n`;
            txt += `📌 *FOREIGNERS*\n━━━━━━━━━━━━━━━━\nSend .foreigners -x to yeet them all\n━━━━━━━━━━━━━━━━\n© bmb tech`;
            await client.sendMessage(m.chat, { text: txt, mentions: foreignList }, { quoted: m });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        } else if (args[0] === '-x') {
            await client.sendMessage(m.chat, {
                text: `📌 *PURGE MODE*\n━━━━━━━━━━━━━━━━\nRemoving all ${foreignList.length} foreigners now.\nGoodbye losers, you won't be missed.\n━━━━━━━━━━━━━━━━\n© bmb tech`
            }, { quoted: m });
            setTimeout(async () => {
                await client.groupParticipantsUpdate(m.chat, foreignList, 'remove');
                setTimeout(() => {
                    sendInteractive(client, m, `📌 *FOREIGNERS*\n━━━━━━━━━━━━━━━━\nAll foreigners removed. Group cleansed.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                }, 1000);
            }, 1000);
        }
    });
};
