import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const DEV_NUMBER = '255767862457';

export default {
    name: 'toxicai',
    aliases: ['devai', 'bmbagent'],
    description: 'Toggle ToxicAgent GitHub AI (dev only)',
    run: async (context) => {
        const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const senderNum = (m.sender || '').split('@')[0].split(':')[0];
        const fmt = (title, lines) => {
            const body = (Array.isArray(lines) ? lines : [lines]).join('\n');
            return `📌 *${title.toUpperCase()}*\n━━━━━━━━━━━━━━━━\n${body}\n━━━━━━━━━━━━━━━━\n© bmb tech`;
        };

        if (senderNum !== DEV_NUMBER) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: fmt('TOXICAGENT', ['Access denied.', 'Dev-only feature. Not your toy.'])
            });
        }

        try {
            const settings = await getSettings();
            const value = (args[0] || '').toLowerCase();

            if (value === 'on' || value === 'off') {
                const newState = value === 'on';
                await updateSetting('toxicagent', newState);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: fmt('TOXICAGENT', newState
                        ? ['Status: ✅ ON', 'GitHub AI agent active. Just text me GitHub tasks.']
                        : ['Status: ❌ OFF', 'GitHub AI disabled.'])
                });
            }

            const isOn = settings.toxicagent === true || settings.toxicagent === 'true';

          await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
          await sendInteractive(client, m, `📌 *TOXICAI*\n━━━━━━━━━━━━━━━━\nStatus: ${settings.toxicai ? 'ON ✅' : 'OFF ❌'}\nOptions:\n${prefix}toxicai on\n${prefix}toxicai off\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        } catch {
            client.sendMessage(m.chat, { text: fmt('TOXICAGENT', 'something broke. try again.') });
        }
    }
};
