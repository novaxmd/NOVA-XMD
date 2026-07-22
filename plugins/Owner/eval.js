import util from 'util';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const BLOCKED_PATTERNS = [
    /process\.env/,
    /config\/settings/,
    /require\s*\(\s*['"].*settings['`]/
];

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, isAdmin, isBotAdmin, Owner, isDev, isSudo, itsMe, store, settings, botNumber, args, pushname, mode, pict, botname, totalCommands, sock, conn, wa, bot, xh, clint } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const raw = (text || (m.quoted && (m.quoted.text || m.quoted.caption)) || '').trim();

        try {
            if (!raw) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return sendInteractive(client, m, `📌 *EVAL*\n━━━━━━━━━━━━━━━━\nYou sent nothing.\nWhat am I supposed to eval,\nyour disappointment?\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
            for (const pattern of BLOCKED_PATTERNS) {
                if (pattern.test(raw)) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    return sendInteractive(client, m, `🚫 *BLOCKED*\n━━━━━━━━━━━━━━━━\nThat eval is blocked for security.\nNice try though.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                }
            }

            let evaled;
            const code = raw.replace(/\r/g, '');
            let lastErr;

            const attempts = [
                `(async () => { return (${code}) })()`,
                `(async () => { ${code} })()`,
                `(async () => { return await (${code}) })()`,
                `(async () => { ${code.startsWith('return ') ? code : 'return ' + code} })()`,
            ];

            for (const attempt of attempts) {
                try {
                    evaled = await eval(attempt);
                    lastErr = null;
                    break;
                } catch (e) {
                    lastErr = e;
                }
            }

            if (lastErr) throw lastErr;

            if (typeof evaled !== 'string') evaled = util.inspect(evaled, { depth: 4 });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await sendInteractive(client, m, String(evaled ?? 'undefined'));
        } catch (err) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *EVAL ERROR*\n━━━━━━━━━━━━━━━━\n${String(err)}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    });
};
