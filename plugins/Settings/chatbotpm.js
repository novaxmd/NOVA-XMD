import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
  name: 'chatbotpm',
  aliases: ['chatbot', 'autoreply'],
  description: 'Toggle Auto AI replies — responds to all DMs and when mentioned or replied to in groups',
  run: async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      const fmt = (title, lines) => {
        const body = (Array.isArray(lines) ? lines : [lines]).join('\n');
        return `📌 *${title.toUpperCase()}*\n━━━━━━━━━━━━━━━━\n${body}\n━━━━━━━━━━━━━━━━\n© bmb tech`;
      };

      try {
        const settings = await getSettings();
        const value = (args[0] || '').toLowerCase();

        if (value === 'on' || value === 'off') {
          const newState = value === 'on';
          if (settings.autoai === newState) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, { text: fmt('AUTO AI', `already ${value.toUpperCase()} 🙄 stop pressing buttons`) });
          }
          await updateSetting('autoai', newState);
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
          return client.sendMessage(m.chat, {
            text: fmt('AUTO AI', newState
              ? ['Status: ✅ ON', 'Replies to all DMs + @mentions in groups.', 'God help them 😒']
              : ['Status: ❌ OFF', 'Silent mode. Finally.'])
          });
        }

        const isOn = settings.autoai === true || settings.autoai === 'true';

          await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
          await sendInteractive(client, m, `🤖 *CHATBOTPM*\n━━━━━━━━━━━━━━━━\nStatus: ${settings.chatbotpm ? 'ON ✅' : 'OFF ❌'}\nOptions:\n${prefix}chatbotpm on\n${prefix}chatbotpm off\n━━━━━━━━━━━━━━━━\n© bmb tech`);

      } catch {
        client.sendMessage(m.chat, { text: fmt('AUTO AI', 'something broke. try again.') });
      }
    });
  }
};
