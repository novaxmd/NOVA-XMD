import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
import asyncPkg from 'async';
const { queue } = asyncPkg;
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { sendInteractive } from '../../lib/sendInteractive.js';

const commandQueue = queue(async (task, callback) => {
    try {
        await task.run(task.context);
    } catch (error) {
        console.error(`Sticker queue error: ${error.message}`);
    }
    callback();
}, 1);

export default async (context) => {
    const { client, m, packname } = context;

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    commandQueue.push({
        context,
        run: async ({ client, m }) => {
            try {
                let mediaMsg = null;
                let mediaType = null;

                if (m.message?.imageMessage) {
                    mediaMsg = m.message.imageMessage;
                    mediaType = 'image';
                } else if (m.message?.videoMessage) {
                    mediaMsg = m.message.videoMessage;
                    mediaType = 'video';
                } else if (m.message?.stickerMessage) {
                    mediaMsg = m.message.stickerMessage;
                    mediaType = 'sticker';
                } else if (m.quoted) {
                    if (m.quoted.mtype === 'imageMessage') {
                        mediaMsg = m.quoted;
                        mediaType = 'image';
                    } else if (m.quoted.mtype === 'videoMessage') {
                        mediaMsg = m.quoted;
                        mediaType = 'video';
                    } else if (m.quoted.mtype === 'stickerMessage') {
                        mediaMsg = m.quoted;
                        mediaType = 'sticker';
                    }
                }

                if (!mediaMsg) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    return sendInteractive(client, m, `🌟 *STICKER*\n━━━━━━━━━━━━━━━━\nWhere's the fvcking image or\nshort video, idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                }

                if (mediaType === 'video' && mediaMsg.seconds > 30) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    return sendInteractive(client, m, `🌟 *STICKER*\n━━━━━━━━━━━━━━━━\nVideos must be 30 seconds or shorter.\nLearn to read, moron.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                }

                const dlType = mediaType === 'sticker' ? 'sticker' : mediaType;
                const stream = await downloadContentFromMessage(mediaMsg, dlType);
                let buffer = Buffer.from([]);
                for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

                const ext = mediaType === 'video' ? 'mp4' : 'jpg';
                const tempFile = path.join(__dirname, `temp-sticker-${Date.now()}.${ext}`);
                await fs.writeFile(tempFile, buffer);

                const sticker = new Sticker(tempFile, {
                    pack: packname || 'NOVA-XMD',
                    author: 'bmbtech [dev]',
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    id: '12345',
                    quality: 50,
                    background: 'transparent'
                });

                const stickerBuffer = await sticker.toBuffer();
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await client.sendMessage(m.chat, { sticker: stickerBuffer });
                await fs.unlink(tempFile).catch(() => {});

            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                console.error(`Sticker error: ${error.message}`);
                await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nError while creating sticker.\nTry again, you failure.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        }
    });
};
