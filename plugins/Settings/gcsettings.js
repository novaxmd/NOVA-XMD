import { getGroupSettings } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;

        const jid = m.chat;

        if (!jid.endsWith('@g.us')) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `⚙️ *GCSETTINGS*\n━━━━━━━━━━━━━━━━\nThis command is for groups only, you fool.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        let groupSettings = await getGroupSettings(jid);

        if (!groupSettings) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `⚙️ *GCSETTINGS*\n━━━━━━━━━━━━━━━━\nNo group settings found. Configure something first!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const on = (v) => (v ? '✅ ON' : '❌ OFF');
        let response = `⚙️ *GROUP SETTINGS*\n━━━━━━━━━━━━━━━━\n`;
        response += `Antilink: ${on(groupSettings.antilink)}
`;
        response += `Antidelete: ${on(groupSettings.antidelete)}
`;
        response += `Events: ${on(groupSettings.events)}
`;
        response += `Antitag: ${on(groupSettings.antitag)}
`;
        response += `GCPresence: ${on(groupSettings.gcpresence)}
`;
        response += `Antiforeign: ${on(groupSettings.antiforeign)}
`;
        response += `Antidemote: ${on(groupSettings.antidemote)}
`;
        response += `Antipromote: ${on(groupSettings.antipromote)}
`;
        response += `Welcome: ${on(groupSettings.welcome)}
`;
        response += `Goodbye: ${on(groupSettings.goodbye)}
`;
        response += `━━━━━━━━━━━━━━━━\n© bmb tech`;

        await sendInteractive(client, m, response);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    });
};
