import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const BMB_API = 'https://url.bmbxmd.workers.dev/api/upload';

const fmt = (msg) => `📤 *URL*\n━━━━━━━━━━━━━━━━\n${msg}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

function fmtSize(bytes) {
    if (!bytes) return '0 B';
    const s = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${s[i]}`;
}

function generateShortId(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default {
    name: 'upload',
    aliases: ['tourl', 'geturl', 'mediaurl', 'url'],
    description: 'Upload media to BMB and get a permanent link',
    run: async (context) => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const q = m.quoted ? m.quoted : m;
            if (!q.mimetype) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return client.sendMessage(m.chat, { text: fmt('Reply to an image, video, audio, or document to upload it.') });
            }

            const buff = await q.download();
            const mime = q.mimetype || 'application/octet-stream';

            // 100MB limit
            if (buff.length > 100 * 1024 * 1024) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return client.sendMessage(m.chat, { text: fmt('File size exceeds 100MB limit.') });
            }

            let extension = '';
            if (mime.includes('image/jpeg')) extension = '.jpg';
            else if (mime.includes('image/png')) extension = '.png';
            else if (mime.includes('image/webp')) extension = '.webp';
            else if (mime.includes('image/gif')) extension = '.gif';
            else if (mime.includes('video')) extension = '.mp4';
            else if (mime.includes('audio')) extension = '.mp3';
            else if (mime.includes('application')) extension = '.pdf';
            else extension = '.bin';

            const shortId = generateShortId(6);
            const filename = `${shortId}${extension}`;
            const size = fmtSize(buff.length);

            const form = new FormData();
            form.append('file', new Blob([buff], { type: mime }), filename);

            const res = await fetch(BMB_API, { method: 'POST', body: form });
            const data = await res.json().catch(() => null);

            if (!data || !data.url) {
                throw new Error('Upload failed. Server did not return a valid URL.');
            }

            const mediaUrl = data.url;

            let mediaType = 'File';
            if (mime.includes('image')) mediaType = 'Image';
            else if (mime.includes('video')) mediaType = 'Video';
            else if (mime.includes('audio')) mediaType = 'Audio';

            const resultText = `📤 *FILE UPLOAD SUCCESS*\n━━━━━━━━━━━━━━━━\n📁 *Type:* ${mediaType}\n📦 *Size:* ${size}\n🔑 *ID:* ${shortId}\n🌐 *Link:* ${mediaUrl}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

            try {
                const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                    interactiveMessage: {
                        body: { text: resultText },
                        footer: { text: '' },
                        nativeFlowMessage: {
                            buttons: [{ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Link', copy_code: mediaUrl }) }],
                            messageParamsJson: ''
                        }
                    }
                }), { userJid: client.user.id });

                await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
            } catch {
                await client.sendMessage(m.chat, { text: resultText });
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        } catch (err) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await client.sendMessage(m.chat, { text: fmt(`Upload failed: ${err.message || err}`) });
        }
    }
};  
