import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { getSettings } from '../../database/config.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { ButtonV2 } from '../../lib/WABuilder.js';

export default {
    name: 'start',
    aliases: ['alive', 'online', 'toxic', 'bot', 'status', 'active', 'check'],
    description: 'Check if bot is alive',
    run: async (context) => {
        const { client, m, mode, pict, botname, text, prefix } = context;

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '🤖', key: m.reactKey } });

        const bmbtechPaths = [
            path.join(__dirname, 'bmb_tech'),
            path.join(process.cwd(), 'bmb_tech'),
            path.join(__dirname, '..', 'bmb_tech')
        ];

        let audioFolder = null;
        for (const folderPath of bmbtechPaths) {
            if (fs.existsSync(folderPath)) { audioFolder = folderPath; break; }
        }

        if (audioFolder) {
            const possibleFiles = [];
            for (let i = 1; i <= 10; i++) {
                for (const ext of ['.mp3', '.m4a', '.ogg', '.opus', '.wav']) {
                    const fullPath = path.join(audioFolder, `menu${i}${ext}`);
                    if (fs.existsSync(fullPath)) possibleFiles.push(fullPath);
                }
            }
            if (possibleFiles.length > 0) {
                const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];
                await client.sendMessage(m.chat, {
                    audio: { url: randomFile }, ptt: true, mimetype: 'audio/mpeg', fileName: 'toxic-start.mp3'
                });
            }
        }

        const settings = await getSettings();
        const effectivePrefix = settings.prefix || '.';
        const device = await getDeviceMode();

        const bodyText = `📌 *START*\n━━━━━━━━━━━━━━━━\nYo @${m.sender.split('@')[0].split(':')[0]}! You actually bothered\nto check if I'm alive?\n${botname} is active 24/7, unlike\nyour brain cells.\nStop wasting my time and pick\nsomething useful below.\n━━━━━━━━━━━━━━━━\n© bmb tech`;

        if (device === 'ios') {
            await client.sendMessage(m.chat, { text: bodyText, mentions: [m.sender] });
            return;
        }

        try {
            const btnV2 = new ButtonV2(client);
            btnV2.setBody(bodyText)

                .addButton('𝐌𝐞𝐧𝐮', `${effectivePrefix}menu`)
                .addButton('𝐏𝐢𝐧𝐠', `${effectivePrefix}ping`)
                .addButton('𝐒𝐞𝐭𝐭𝐢𝐧𝐠𝐬', `${effectivePrefix}settings`);
            await btnV2.send(m.chat, { userJid: client.user?.id || '', mentions: [m.sender] });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        } catch {
            await client.sendMessage(m.chat, { text: bodyText, mentions: [m.sender] });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        }
    } };
