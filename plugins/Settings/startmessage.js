import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    const formatStylishReply = (message) => {
      return `📌 *STARTMESSAGE*\n━━━━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━━━━\n© bmb tech`;
    };

    try {
      const settings = await getSettings();

      const value = args.join(" ").toLowerCase();

      if (value === 'on' || value === 'off') {
        const action = value === 'on';
        if (settings.startmessage === action) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

          return await client.sendMessage(
            m.chat,
            { text: formatStylishReply(`Start message is already ${value.toUpperCase()}, you brain-dead fool! Stop wasting my time. 😈`) },
            { ad: true }
          );
        }

        await updateSetting('startmessage', action);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        return await client.sendMessage(
          m.chat,
          { text: formatStylishReply(`Start message ${value.toUpperCase()} activated! 🔥 ${action ? 'Welcome messages will be sent on connection! 🎉' : 'No more annoying welcome messages, you antisocial prick! 🚫'}`) },
          { ad: true }
        );
      }

          await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
          await sendInteractive(client, m, `📌 *STARTMESSAGE*\n━━━━━━━━━━━━━━━━\nStatus: ${settings.startmessage ? 'ON ✅' : 'OFF ❌'}\nOptions:\n${prefix}startmessage on\n${prefix}startmessage off\n━━━━━━━━━━━━━━━━\n© bmb tech`);

    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      await client.sendMessage(
        m.chat,
        { text: formatStylishReply("Shit broke, couldn't mess with start message. Database or something's fucked. Try later.") },
        { ad: true }
      );
    }
  });
};