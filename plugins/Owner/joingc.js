import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, args, Owner, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!botname) {
            console.error(`Join-Error: botname missing in context.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nBot's fucked. No botname in context.\nYell at your dev, dumbass.\n━━━━━━━━━━━━━━━━\n© bmb tech`
            );
        }

        if (!Owner) {
            console.error(`Join-Error: Owner missing in context.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nBot's broken. No owner in context.\nGo cry to the dev.\n━━━━━━━━━━━━━━━━\n© bmb tech`
            );
        }

        let raw = (text && text.trim()) || (m.quoted && ((m.quoted.text) || (m.quoted && m.quoted.caption))) || "";
        raw = String(raw || "").trim();

        if (!raw) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `📌 *USAGE*\n━━━━━━━━━━━━━━━━\nProvide a real group invite link\nor reply to one.\nExample: *${args && args[0] ? args[0] : '.join https://chat.whatsapp.com/abcdef...'}*\n━━━━━━━━━━━━━━━━\n© bmb tech`
            );
        }

        const urlRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i;
        const match = raw.match(urlRegex);
        let inviteCode = match ? match[1] : null;

        if (!inviteCode) {
            const token = raw.split(/\s+/)[0];
            if (/^[A-Za-z0-9_-]{8 }$/.test(token)) {
                inviteCode = token;
            }
        }

        if (!inviteCode) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nThat ain't a valid link or invite\ncode. Don't waste my time.\n━━━━━━━━━━━━━━━━\n© bmb tech`
            );
        }

        inviteCode = inviteCode.replace(/\?.*$/, '').trim();

        try {
            const info = await client.groupGetInviteInfo(inviteCode);
            const subject = info?.subject || info?.groupMetadata?.subject || "Unknown Group";

            await client.groupAcceptInvite(inviteCode);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, 
                `📌 *JOINED*\n━━━━━━━━━━━━━━━━\nJoined: *${subject}*\nDon't spam, or I'll ghost you.\n— ${botname}\n━━━━━━━━━━━━━━━━\n© bmb tech`
            );
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.error(`[JOIN-ERROR] invite=${inviteCode}`, error && (error.stack || error));

            const status =
                (error && error.output && error.output.statusCode) ||
                error?.statusCode ||
                error?.status ||
                (error?.data && (error.data.status || error.data)) ||
                (error?.response && error.response.status) ||
                null;

            if (status === 400 || status === 404) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nGroup does not exist or the link\nis invalid. Stop sending trash links.\n━━━━━━━━━━━━━━━━\n© bmb tech`
                );
            }
            if (status === 401) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nI was previously removed from that\ngroup. I can't rejoin using this link.\n━━━━━━━━━━━━━━━━\n© bmb tech`
                );
            }
            if (status === 409) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nI'm already in that group, genius.\nYou trying to confuse me?\n━━━━━━━━━━━━━━━━\n© bmb tech`
                );
            }
            if (status === 410) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nThat invite link was reset. Get a\nfresh one and try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`
                );
            }
            if (status === 403) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nI don't have permission to join\nthat group. Maybe it's private.\n━━━━━━━━━━━━━━━━\n© bmb tech`
                );
            }
            if (status === 500) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `📌 *JOINGC*\n━━━━━━━━━━━━━━━━\nThat group is full or server error.\nTry later or check the link.\n━━━━━━━━━━━━━━━━\n© bmb tech`
                );
            }

            const shortMsg = (error && (error.message || (typeof error === 'string' ? error : 'Unknown error'))) || 'Unknown error';
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nFailed to join: ${shortMsg}\nCheck the link or try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`
            );
        }
    });
};
