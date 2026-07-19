import { uploadToUrl } from '../../lib/toUrl.js';
  import { makeRC } from '../../lib/toxicApi.js';
    import { getSettings } from '../../database/config.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

  export default {
      name: 'rc',
      aliases: ['airc', 'rcedit'],
      description: 'AI image edit using RC model',
      category: 'Editing',
      run: async (context) => {
          const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const quoted = m.quoted ? m.quoted : null;
          const mime = quoted?.mimetype || '';
          const prompt = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!quoted || !/image/.test(mime)) {
              return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nReply to an image with a prompt.\nExample: ${prefix}rc make it look like night\n━━━━━━━━━━━━━━━━\n© bmb tech`);
          }

          if (!prompt) {
              return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nTell me what to do with the image.\nExample: ${prefix}rc make it look like night\n━━━━━━━━━━━━━━━━\n© bmb tech`);
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

          try {
              const media = await quoted.download();
              const imgUrl = await uploadToUrl(media);
              const resultUrl = await makeRC(imgUrl, prompt);

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  image: { url: resultUrl },
                  caption: `📌 *RC EDIT*\n━━━━━━━━━━━━━━━━\nPrompt: ${prompt}\n━━━━━━━━━━━━━━━━\n© bmb tech`
              });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
              await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nRC edit failed. Try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
          }
      }
  };
  