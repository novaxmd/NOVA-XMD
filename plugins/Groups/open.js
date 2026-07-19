import middleware from '../../utils/botUtil/middleware.js';
import { parseDelay, scheduleAction, cancelScheduled } from '../../lib/groupTimers.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, args } = context;
        const delayMs = parseDelay(args?.[0]);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (delayMs !== null) {
            const label = args[0];
            cancelScheduled(m.chat, 'open');
            scheduleAction(m.chat, 'open', delayMs, async () => {
                try {
                    await client.groupSettingUpdate(m.chat, 'not_announcement');
                    await sendInteractive(client, m, `📌 *OPENED*\n━━━━━━━━━━━━━━━━\n⏰ Scheduled open executed!\nGroup is now open.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                } catch {}
            });
            await client.sendMessage(m.chat, { react: { text: '⏰', key: m.reactKey } });
            return m.reply(`📌 *TIMER SET*\n━━━━━━━━━━━━━━━━\n⏰ Group will open in *${label}*.\nUse .open to cancel & open now.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        try {
            cancelScheduled(m.chat, 'open');
            await client.groupSettingUpdate(m.chat, 'not_announcement');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            m.reply(`📌 *OPENED*\n━━━━━━━━━━━━━━━━\nGroup opened. Talk your trash.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            m.reply(`│ Failed to open group: ${e.message?.slice(0, 60)}\n╰───────────────\n> ©BMB TECH`);
        }
    });
};
