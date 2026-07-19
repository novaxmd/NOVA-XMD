import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    const formatStylishReply = (title, message) => {
      return `📌 *${TITLE}*\n━━━━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━━━━\n© bmb tech`;
    };

    try {
      const settings = await getSettings();

      const value = args.join(" ").toLowerCase();

      const _ON  = new Set(['on','enable','enabled','activate','activated','true','1','yes','start']);
          const _OFF = new Set(['off','disable','disabled','deactivate','deactivated','false','0','no','stop']);
        if (_ON.has(value) || _OFF.has(value)) {
        const action = _ON.has(value);
        if (settings.autobio === action) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply("AUTOBIO", `Autobio's already ${value.toUpperCase()}, you brain-dead fool! Stop wasting my time.\n│ \n│ 📌 Usage: ${prefix}autobio on | ${prefix}autobio off`) },
            { ad: true }
          );
        }

        await updateSetting('autobio', action);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("AUTOBIO", `Autobio ${value.toUpperCase()} activated! ${action ? 'Bot\'s flexing status updates every 10 seconds, bow down!' : 'No more status flexing, you\'re not worth it.'}\n│ \n│ 📌 Usage: ${prefix}autobio on | ${prefix}autobio off`) },
          { ad: true }
        );
      }

          await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
          await sendInteractive(client, m, `📌 *AUTOBIO*\n━━━━━━━━━━━━━━━━\nStatus: ${settings.autobio ? 'ON ✅' : 'OFF ❌'}\nOptions:\n${prefix}autobio on\n${prefix}autobio off\n━━━━━━━━━━━━━━━━\n© bmb tech`);

    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("AUTOBIO", "Shit broke, couldn't mess with autobio. Database or something's fucked. Try later.") },
        { ad: true }
      );
    }
  });
};
