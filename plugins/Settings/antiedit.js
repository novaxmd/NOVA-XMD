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

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.antiedit === action) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply("ANTIEDIT", `Antiedit's already ${value.toUpperCase()}, you brain-dead fool! Stop wasting my time.\n│ \n│ 📌 Usage: ${prefix}antiedit on | ${prefix}antiedit off`) },
            { ad: true }
          );
        }

        await updateSetting('antiedit', action);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply("ANTIEDIT", `Antiedit ${value.toUpperCase()} activated! ${action ? 'Every sneaky edit gets caught now. No hiding.' : 'Edits fly under the radar. Your loss.'}\n│ \n│ 📌 Usage: ${prefix}antiedit on | ${prefix}antiedit off`) },
          { ad: true }
        );
      }

          await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
          await sendInteractive(client, m, `🛡️ *ANTIEDIT*\n━━━━━━━━━━━━━━━━\nStatus: ${settings.antiedit ? 'ON ✅' : 'OFF ❌'}\nOptions:\n${prefix}antiedit on\n${prefix}antiedit off\n━━━━━━━━━━━━━━━━\n© bmb tech`);

    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("ANTIEDIT", "Shit broke, couldn't mess with antiedit. Try later.") },
        { ad: true }
      );
    }
  });
};
