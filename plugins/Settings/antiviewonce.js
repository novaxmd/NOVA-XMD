import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const fmt = (title, msg) =>
            `📌 *${TITLE}*\n━━━━━━━━━━━━━━━━\n${msg}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

        try {
            const settings = await getSettings();

            const value = args.join(' ').toLowerCase();

            const _ON  = new Set(['on','enable','enabled','activate','activated','true','1','yes','start']);
          const _OFF = new Set(['off','disable','disabled','deactivate','deactivated','false','0','no','stop']);
        if (_ON.has(value) || _OFF.has(value)) {
                const action = _ON.has(value);
                if (settings.antiviewonce === action) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await sendInteractive(client, m, fmt('ANTIVIEWONCE', `Antiviewonce is already ${value.toUpperCase()}, genius. Stop wasting my time.\n│ \n│ 📌 Usage: ${prefix}antiviewonce on | ${prefix}antiviewonce off`));
                }

                await updateSetting('antiviewonce', action);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return await sendInteractive(client, m, fmt('ANTIVIEWONCE', `Antiviewonce ${value.toUpperCase()}! ${action ? 'Every view-once gets saved to my DM. Nothing gets past me. 😈' : 'View-once messages are free to vanish now.'}\n│ \n│ 📌 Usage: ${prefix}antiviewonce on | ${prefix}antiviewonce off`));
            }

            await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
            await sendInteractive(client, m, `🛡️ *ANTIVIEWONCE*\n━━━━━━━━━━━━━━━━\nStatus: ${settings.antiviewonce ? 'ON ✅' : 'OFF ❌'}\nTo turn ON:  ${prefix}antiviewonce on\nTo turn OFF: ${prefix}antiviewonce off\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await sendInteractive(client, m, fmt('ANTIVIEWONCE', `Something broke: ${error.message || 'Try again later.'}`));
        }
    });
};
