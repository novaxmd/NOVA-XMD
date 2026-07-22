import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, getGroupSettings, updateGroupSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    const value = args[0]?.toLowerCase();
    const jid = m.chat;

    const formatStylishReply = (title, message) => {
      return `📌 *${TITLE}*\n━━━━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━━━━\n© bmb tech`;
    };

    if (!jid.endsWith('@g.us')) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIDEMOTE", "Epic fail, loser!\n│ This command is for groups only, moron!") });
    }

    const settings = await getSettings();
    const prefix = settings.prefix;

    let groupSettings = await getGroupSettings(jid);
    let isEnabled = groupSettings?.antidemote === true;

    if (value === 'on' || value === 'off') {
      const action = value === 'on';

      if (isEnabled === action) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIDEMOTE", `Antidemote is already ${value.toUpperCase()}, you brainless fool!\n│ Quit wasting my time!\n│ \n│ 📌 Usage: ${prefix}antidemote on | ${prefix}antidemote off`) });
      }

      await updateGroupSetting(jid, 'antidemote', action);
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIDEMOTE", `Antidemote ${value.toUpperCase()}!\n│ Demotions are under my watch, king!\n│ \n│ 📌 Usage: ${prefix}antidemote on | ${prefix}antidemote off`) });
    }

          await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
          await sendInteractive(client, m, `🛡️ *ANTIDEMOTE*\n━━━━━━━━━━━━━━━━\nStatus: ${settings.antidemote ? 'ON ✅' : 'OFF ❌'}\nOptions:\n${prefix}antidemote on\n${prefix}antidemote off\n━━━━━━━━━━━━━━━━\n© bmb tech`);

  });
};
