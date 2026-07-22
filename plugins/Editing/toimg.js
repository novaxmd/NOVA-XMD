import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { tmpdir } from 'os';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'toimg',
    aliases: ['toimage', 'stickertoimg', 'sticker'],
    description: 'Converts stickers to images',
    run: async (context) => {
        const { client, m } = context;
        let mediaPath = null;
        let outPath = null;
        
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            
            if (!m.quoted) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `🖼️ *TO IMAGE*\n━━━━━━━━━━━━━━━━\nAre you illiterate? QUOTE A STICKER.\nThe command is not a suggestion.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
            
            const quotedMime = m.quoted.mimetype || '';
            if (!/webp/.test(quotedMime)) return sendInteractive(client, m, `🖼️ *TO IMAGE*\n━━━━━━━━━━━━━━━━\nThat is not a sticker. Do you need\nglasses? That is clearly not a .webp file.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            
            mediaPath = await m.quoted.download();
            if (!mediaPath) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nFailed to download the sticker.\nYour phone is probably as useless\nas you are.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
            
            const tempFile = path.join(tmpdir(), `sticker_${Date.now()}.webp`);
            outPath = path.join(tmpdir(), `sticker_${Date.now()}.png`);
            
            fs.writeFileSync(tempFile, mediaPath);
            
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${tempFile} ${outPath}`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            const imageBuffer = fs.readFileSync(outPath);
            
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            
            await client.sendMessage(m.chat, { 
                image: imageBuffer, 
                caption: `🖼️ *TO IMAGE*\n━━━━━━━━━━━━━━━━\nYour sticker is now an image.\nA miraculous achievement.\n━━━━━━━━━━━━━━━━\n© bmb tech` 
            });
            
            await client.sendMessage(m.chat, { 
                document: imageBuffer, 
                mimetype: 'image/png', 
                fileName: `sticker_${Date.now()}.png`, 
                caption: `📌 *PNG FILE*\n━━━━━━━━━━━━━━━━\nPNG version. Slightly less terrible.\n━━━━━━━━━━━━━━━━\n© bmb tech` 
            });
            
            try {
                fs.unlinkSync(tempFile);
                fs.unlinkSync(outPath);
            } catch (e) {}
            
        } catch (err) {
            console.error('ToImg error:', err);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            
            let userMessage = 'The conversion failed. Shocking.';
            if (err.message.includes('timeout')) userMessage = 'Took too long. Your sticker is probably as bloated as your ego.';
            if (err.message.includes('Network Error')) userMessage = 'Network error. Is your router powered by hopes and dreams?';
            
            await sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\n${userMessage}\nError: ${err.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            
            try {
                if (mediaPath) fs.unlinkSync(mediaPath);
                if (outPath) fs.unlinkSync(outPath);
            } catch (e) {}
        }
    }
};