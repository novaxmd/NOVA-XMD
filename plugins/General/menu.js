import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { sendInteractive } from '../../lib/sendInteractive.js';
import { getGreeting } from '../../lib/language.js';

const getTimeGreeting = () => {
    try { return getGreeting(); } catch {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good morning';
        if (hour >= 12 && hour < 17) return 'Good afternoon';
        if (hour >= 17 && hour < 21) return 'Good evening';
        return 'Good night';
    }
};

const toFancyFont = (text, isUpperCase = false) => {
    const fonts = {
        'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
        'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
        'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
        'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
    };
    return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
        .split('')
        .map(char => fonts[char] || char)
        .join('');
};

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const mnt = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [d && `${d}d`, h && `${h}h`, mnt && `${mnt}m`, s && `${s}s`].filter(Boolean).join(' ') || '0s';
}

const TOP = '╭──═════════════⚜';
const MID = '╠──═════════════⚜';
const BOT = '╰──═════════════⚜';
const BOTHEART = '╰──═════════════♡';

export default {
    name: 'menu',
    aliases: ['commands', 'list', 'cmds', 'm', 'cmd', 'commandlist', 'allcmds'],
    description: 'Displays the NOVA-XMD command menu',
    run: async (context) => {
        const { client, m, mode, pict, totalCommands, prefix } = context;

        await client.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });

        const bodyText = m.body || '';
        const cleanText = bodyText.trimStart().slice(prefix.length).trimStart();
        const firstWord = cleanText.split(' ')[0].toLowerCase();

        if (cleanText !== '' && !['menu', 'commands', 'list', 'cmds', 'm', 'help', 'cmd', 'commandlist', 'allcmds'].includes(firstWord)) {
            const commandName = cleanText.split(' ')[0];
            return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nYo ${m.pushName}, what's with the\nextra bullshit after "${commandName}"?\nJust type *${prefix}menu* properly, moron.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const greeting = getTimeGreeting();
        const uptimeStr = formatUptime(process.uptime());
        const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        const ramMB = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

        const categories = [
            { name: 'General', display: 'GENERAL', emoji: '📜' },
            { name: 'Settings', display: 'SETTINGS', emoji: '🛠️' },
            { name: 'Owner', display: 'OWNER', emoji: '👑' },
            { name: 'Heroku', display: 'HEROKU', emoji: '☁️' },
            { name: 'Privacy', display: 'PRIVACY', emoji: '🔒' },
            { name: 'Groups', display: 'GROUP', emoji: '👥' },
            { name: 'AI', display: 'AI', emoji: '🧠' },
            { name: 'Downloads', display: 'DOWNLOAD', emoji: '💼' },
            { name: 'Editing', display: 'EDITING', emoji: '✂️' },
            { name: 'Effects', display: 'EFFECTS', emoji: '🎨' },
            { name: 'Anime', display: 'ANIME', emoji: '🎌' },
            { name: 'NSFW', display: '+18', emoji: '🔞' },
            { name: 'Utils', display: 'UTILS', emoji: '🔧' },
            { name: 'Reactions', display: 'REACTIONS', emoji: '🎭' }
        ];

        let menuText =
            `${TOP}\n` +
            `║ ✨ *NOVA XMD BOT* ✨\n` +
            `${MID}\n` +
            `║\n` +
            `║ 👤 *USER:* ${m.pushName || 'there'}\n` +
            `║ 🚀 *PLUGINS:* ${totalCommands || ''}\n` +
            `║ ⏳ *UPTIME:* ${uptimeStr}\n` +
            `║ 📅 *DATE:* ${dateStr}\n` +
            `║ 📊 *RAM:* ${ramMB}MB\n` +
            `║ 🌐 *MODE:* ${mode}\n` +
            `║\n` +
            `${BOT}\n\n`;

        for (let ci = 0; ci < categories.length; ci++) {
            const category = categories[ci];
            let commandFiles;
            try {
                commandFiles = fs.readdirSync(`./plugins/${category.name}`).filter(file => file.endsWith('.js') && file !== 'links.js');
            } catch (e) { continue; }

            if (commandFiles.length === 0 && category.name !== 'NSFW') continue;

            const names = [];

            if (category.name === 'NSFW') {
                names.push('xvideo');
            }

            for (const file of commandFiles) {
                let displayName = file.replace('.js', '');
                try {
                    const { pathToFileURL } = await import('url');
                    const modUrl = pathToFileURL(path.join(process.cwd(), 'plugins', category.name, file)).href;
                    const modRaw = await import(modUrl);
                    const mod = modRaw.default !== undefined ? modRaw.default : modRaw;
                    if (Array.isArray(mod)) {
                        for (const cmd of mod) {
                            if (cmd && cmd.name) names.push(cmd.name);
                        }
                        continue;
                    }
                    if (mod && typeof mod === 'object' && mod.name && typeof mod.name === 'string') {
                        displayName = mod.name;
                    }
                } catch (e) {}
                names.push(displayName);
            }

            const isLast = ci === categories.length - 1;
            menuText += `${TOP}\n`;
            menuText += `║ ${category.emoji} *${category.display}*\n`;
            menuText += `${MID}\n`;
            menuText += `║\n`;
            for (const n of names) {
                menuText += `║ ◇ ${prefix}${n}\n`;
            }
            menuText += `║\n`;
            menuText += `${isLast ? BOTHEART : BOT}\n\n`;
        }

        menuText += `© bmb tech`;

        await client.sendMessage(m.chat, {
            image: pict,
            caption: menuText,
            mentions: [m.sender]
        });

        const bmbtechPaths = [
            path.join(__dirname, 'bmb_tech'),
            path.join(process.cwd(), 'bmb_tech'),
            path.join(__dirname, '..', 'bmb_tech')
        ];
        let audioFolder = null;
        for (const folderPath of bmbtechPaths) {
            if (fs.existsSync(folderPath)) { audioFolder = folderPath; break; }
        }
        if (!audioFolder) return;
        const menuFiles = ['menu1.mp3', 'menu2.mp3', 'menu3.mp3', 'menu4.mp3'];
        const possibleFiles = menuFiles.map(f => path.join(audioFolder, f)).filter(f => fs.existsSync(f));
        if (possibleFiles.length === 0) return;
        const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
            const audioBuffer = fs.readFileSync(randomFile);
            await client.sendMessage(m.chat, { audio: audioBuffer, ptt: true, mimetype: 'audio/mpeg', fileName: 'nova-menu.m4a' });
        } catch {
            await client.sendMessage(m.chat, { audio: { url: randomFile }, ptt: true, mimetype: 'audio/mpeg', fileName: 'nova-menu.m4a' });
        }
    }
};
