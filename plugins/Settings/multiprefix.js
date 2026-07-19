import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const fmt = (msg) => `📌 *MULTIPREFIX*\n━━━━━━━━━━━━━━━━\n${msg}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

        try {
            const settings = await getSettings();
            const isEnabled = settings.multiprefix === 'true' || settings.multiprefix === true;
            const value = args[0]?.toLowerCase();

            if (value === 'on' || value === 'all') {
                if (isEnabled) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await client.sendMessage(m.chat, { text: fmt('Multi-prefix already ON, clown. 🔥 All prefixes (. ! / #) work.') });
                }
                await updateSetting('multiprefix', true);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return await client.sendMessage(m.chat, { text: fmt('Multi-prefix: *ON 🔥* — . ! / # all work now. Enjoy, you picky bastard.') });
            }

            if (value === 'off') {
                if (!isEnabled) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await client.sendMessage(m.chat, { text: fmt(`Multi-prefix already OFF, clown. 🙄 Single prefix: *${settings.prefix || '.'}*`) });
                }
                await updateSetting('multiprefix', false);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return await client.sendMessage(m.chat, { text: fmt(`Multi-prefix: *OFF 🧊* — single prefix only: *${settings.prefix || '.'}*`) });
            }

                await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
                await sendInteractive(client, m, `📌 *MULTIPREFIX*\n━━━━━━━━━━━━━━━━\nStatus: ${isEnabled ? 'ON ✅' : 'OFF ❌'}\nOptions:\n${prefix}multiprefix on\n${prefix}multiprefix off\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        } catch (err) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await client.sendMessage(m.chat, { text: fmt(`Exploded. 💀 Error: ${err.message}`) });
        }
    });
};
