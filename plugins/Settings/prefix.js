import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const newPrefix = args[0];

    const settings = await getSettings();

    if (newPrefix === 'null') {
      if (!settings.prefix) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await sendInteractive(client, m, 
          `` +
          `🔧 *PREFIX*\n` +
          `━━━━━━━━━━━━━━━━\n` +
          `Already prefixless, you clueless twit! 😈\n` +
          `Stop wasting my time! 🖕\n` +
          `━━━━━━━━━━━━━━━━\n` +
          `© bmb tech`
        );
      }
      await updateSetting('prefix', '');
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await sendInteractive(client, m, 
        `` +
        `🔧 *PREFIX*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `Prefix obliterated! 🔥\n` +
        `I’m prefixless now, bow down! 😈\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `© bmb tech`
      );
    } else if (newPrefix) {
      if (settings.prefix === newPrefix) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await sendInteractive(client, m, 
          `` +
          `🔧 *PREFIX*\n` +
          `━━━━━━━━━━━━━━━━\n` +
          `Prefix is already ${newPrefix}, moron! 😈\n` +
          `Try something new, fool! 🥶\n` +
          `━━━━━━━━━━━━━━━━\n` +
          `© bmb tech`
        );
      }
      await updateSetting('prefix', newPrefix);
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await sendInteractive(client, m, 
        `` +
        `🔧 *PREFIX*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `New prefix set to ${newPrefix}! 🔥\n` +
        `Obey the new order, king! 😈\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `© bmb tech`
      );
    } else {
      await sendInteractive(client, m, 
        `` +
        `🔧 *PREFIX*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `Current Prefix: ${settings.prefix || 'No prefix, peasant! 🥶'}\n` +
        `Use "${settings.prefix || '.'}prefix null" to go prefixless or "${settings.prefix || '.'}prefix <symbol>" to set one, noob!\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `© bmb tech`
      );
    }
  });
};