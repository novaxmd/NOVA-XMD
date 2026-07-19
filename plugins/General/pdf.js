import { makePDF } from '../../lib/toxicApi.js';
    import { getSettings } from '../../database/config.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

  export default {
      name: 'pdf',
      aliases: ['topdf', 'createpdf', 'makepdf'],
      description: 'Create a PDF from text',
      category: 'General',
      run: async (context) => {
          const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const query = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!query) {
              return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nGive me some text to convert.\nExample: ${prefix}pdf Hello world this is my document\n━━━━━━━━━━━━━━━━\n© bmb tech`);
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

          try {
              const pdfBuf = await makePDF(query);

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  document: pdfBuf,
                  mimetype: 'application/pdf',
                  fileName: `document_${Date.now()}.pdf`,
                  caption: `📌 *PDF CREATED*\n━━━━━━━━━━━━━━━━\nHere's your document.\n━━━━━━━━━━━━━━━━\n© bmb tech`
              });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
              await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nPDF creation failed. Try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
          }
      }
  };
  