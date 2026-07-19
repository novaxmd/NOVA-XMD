import { getSettings } from '../../database/config.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
  name: 'addbutton',
  aliases: ['addbtn'],
  description: 'Adds a custom button to the menu',
  run: async (context) => {
    const { client, m, args } = context;
    try {
      if (args.length < 2) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await sendInteractive(client, m, `📌 *USAGE*\n━━━━━━━━━━━━━━━━\n.addbutton <button_name> <command>\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        return;
      }
      const buttonName = args[0];
      const command = args[1];
      await sendInteractive(client, m, `✅ *BUTTON ADDED*\n━━━━━━━━━━━━━━━━\nAdded button "${buttonName}"\nfor command "${command}"\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error(`AddButton error: ${error.stack}`);
      await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nError adding custom button.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
  }
};
