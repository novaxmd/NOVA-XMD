import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.quoted) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `📌 *VIEW ONCE*\n━━━━━━━━━━━━━━━━\nReply to a view-once image or video.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    try {
        const quoted = m.msg?.contextInfo?.quotedMessage || null;
        const viewOnce = quoted?.viewOnceMessageV2?.message || quoted?.viewOnceMessageV2Extension?.message || quoted?.viewOnceMessage || quoted;
        const imageMsg = viewOnce?.imageMessage || viewOnce?.imageMessageV2 || viewOnce?.imageMessageV1;
        const videoMsg = viewOnce?.videoMessage || viewOnce?.videoMessageV2 || viewOnce?.videoMessageV1;
        const audioMsg = viewOnce?.audioMessage || viewOnce?.audioMessageV2 || viewOnce?.audioMessageV1;
        const mediaMessage = imageMsg || videoMsg || audioMsg;

        if (!mediaMessage) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *VIEW ONCE*\n━━━━━━━━━━━━━━━━\nThis message does not contain\nview-once media.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const buffer = await client.downloadMediaMessage(mediaMessage);
        if (!buffer || buffer.length === 0) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *VIEW ONCE*\n━━━━━━━━━━━━━━━━\nFailed to download media.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const dest = m.chat;
        const caption = `📌 *VIEW ONCE*\n━━━━━━━━━━━━━━━━\nHere's your media, perv.\n━━━━━━━━━━━━━━━━\n© bmb tech`;

        if (imageMsg) {
            await client.sendMessage(dest, { image: buffer, caption });
        } else if (videoMsg) {
            await client.sendMessage(dest, { video: buffer, caption });
        } else {
            const mime = audioMsg.mimetype || 'audio/ogg; codecs=opus';
            const isPtt = audioMsg.ptt !== false;
            await client.sendMessage(dest, { audio: buffer, ptt: isPtt, mimetype: mime });
        }
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    } catch (error) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to retrieve view-once media.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
