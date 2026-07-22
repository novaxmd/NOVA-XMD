import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import linkMiddleware from '../../utils/botUtil/linkMiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  await linkMiddleware(context, async () => {
    const { client, m } = context;

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    try {
      const code = await client.groupInviteCode(m.chat);
      const link = `https://chat.whatsapp.com/${code}`;

      const bodyText =
        `🔗 *GROUP LINK*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `${link}\n` +
        `\n` +
        `Here's your precious link.\n` +
        `Copy it and stop bugging me.\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `© bmb tech`;

      let sent = false;
      try {
        const msg = generateWAMessageFromContent(
          m.chat,
          {
            interactiveMessage: {
              body: { text: bodyText },
              footer: { text: '' },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                      display_text: 'Copy Link',
                      copy_code: link
                    })
                  }
                ]
              }
            }
          },
          { userJid: client.user?.id }
        );
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        sent = true;
      } catch {}
      if (!sent) {
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await sendInteractive(client, m, bodyText);
      }
    } catch {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nCouldn't fetch the link.\nEither make me admin or quit.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
  });
};
