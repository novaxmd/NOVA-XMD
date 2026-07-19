const DEV_JID = '255767862457@s.whatsapp.net';

export default {
    name: 'report',
    aliases: ['bug', 'feedback'],
    description: 'Report a bug or issue directly to the developer',
    run: async (context) => {
        const { client, m, text, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const box = (lines) => {
            const body = (Array.isArray(lines) ? lines : [lines]).join('\n');
            return `📢 *REPORT*\n━━━━━━━━━━━━━━━━\n${body}\n━━━━━━━━━━━━━━━━\n© bmb tech`;
        };

        const reportText = text || (m.quoted ? (m.quoted.text || m.quoted.body || '') : '');

        if (!reportText || !reportText.trim()) {
            return client.sendMessage(m.chat, {
                text: box([
                    `Usage: *${prefix}report <your message>*`,
                    `Or reply to a message and type *${prefix}report*`,
                    ``,
                    `Example: *${prefix}report play cmd not working*`
                ])
            });
        }

        const senderNum = m.sender.replace(/@s\.whatsapp\.net$/, '').split(':')[0];
        const chatType = m.isGroup ? `Group: ${m.chat}` : 'DM';
        const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });

        const devMsg = `📌 *🐛 BUG REPORT*\n━━━━━━━━━━━━━━━━\nFrom: @${senderNum}\nName: ${m.pushName || 'Unknown'}\nChat: ${chatType}\nTime: ${now}\nReport:\n${reportText.split('\n')}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

        try {
            await client.sendMessage(DEV_JID, {
                text: devMsg,
                mentions: [m.sender]
            });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                text: box([
                    `Your report has been sent to the developer.`,
                    ``,
                    `*Report:* ${reportText.slice(0, 120)}${reportText.length > 120 ? '...' : ''}`,
                    ``,
                    `The dev will look into it. Thanks for reporting.`
                ])
            });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                text: box([`Failed to send report. Try again later.`])
            });
        }
    }
};
