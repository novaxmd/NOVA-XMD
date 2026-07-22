import middleware from '../../utils/botUtil/middleware.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'tagadmins',
    aliases: ['tagadminto', 'pingjidmins', 'calladmins'],
    description: 'Mentions all admins in the group',
    run: async (context) => {
        await middleware(context, async () => {
            const { client, m, text, groupMetadata } = context;
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            if (!m.isGroup) return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nGroup only command.\n━━━━━━━━━━━━━━━━\n© bmb tech`);

            const resolveParticipantJid = (p, participants) => {
                if (p.pn) return String(p.pn).replace(/\D/g, '') + '@s.whatsapp.net';
                const base = p.jid || p.id || '';
                if (base && !base.endsWith('@lid')) return base.split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
                return resolveTargetJid(base, participants);
            };

            try {
                const participants = groupMetadata?.participants || [];
                const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
                const mentions = admins.map(p => resolveParticipantJid(p, participants)).filter(Boolean);

                if (!mentions.length) return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nNo admins found in this group.\n━━━━━━━━━━━━━━━━\n© bmb tech`);

                const txt = [
                    `👮 *ADMINS*`,
                    `━━━━━━━━━━━━━━━━`,
                    text ? text : 'Calling all admins 📢',
                    '',
                    ...mentions.map(id => `@${id.split('@')[0]}`),
                    `━━━━━━━━━━━━━━━━`,
                    '© bmb tech'
                ].join('\n');

                await client.sendMessage(m.chat, { text: txt, mentions });
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            } catch (err) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to fetch admins.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        });
    }
};