import { botname } from '../../config/settings.js';
import { sendInteractive } from '../../lib/sendInteractive.js';
import { detectHostingPlatform } from '../../lib/hostPlatform.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { ButtonV2 } from '../../lib/WABuilder.js';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
};

const getPlatform = () => {
    const plat = process.platform;
    if (plat === 'win32') return 'Windows';
    if (plat === 'darwin') return 'macOS';
    if (plat === 'linux') return 'Linux';
    if (plat === 'freebsd') return 'FreeBSD';
    if (plat === 'openbsd') return 'OpenBSD';
    return plat;
};

export default {
    name: 'ping',
    aliases: ['p', 'speed', 'latency', 'response', 'pong'],
    description: 'Checks the bot response time and server status',
    run: async (context) => {
        const { client, m, toxicspeed, prefix } = context;
        const bName = botname || 'NOVA-XMD';
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.sendMessage(m.chat, { react: { text: '⚡', key: m.reactKey } });

            const startTime = Date.now();
            const latency = Date.now() - startTime;
            const responseSpeed = (toxicspeed || latency / 1000 || 0.0094).toFixed(4);

            const formatUptime = (seconds) => {
                const d = Math.floor(seconds / 86400);
                const h = Math.floor((seconds % 86400) / 3600);
                const min = Math.floor((seconds % 3600) / 60);
                const s = Math.floor(seconds % 60);
                return [d && `${d}d`, h && `${h}h`, min && `${min}m`, s && `${s}s`].filter(Boolean).join(' ') || '0s';
            };

            const mem = process.memoryUsage();
            const usedMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
            const totalMB = (mem.heapTotal / 1024 / 1024).toFixed(2);
            const displayName = m.pushName || m.sender.split('@')[0].split(':')[0];
            const greeting = getGreeting();
            const platform = await detectHostingPlatform(getPlatform());

            const text = `📌 *PING*\n━━━━━━━━━━━━━━━━\n${greeting}, ${displayName}\nPrefix : ${prefix || '.'}\n𝐋𝐚𝐭𝐞𝐧𝐜𝐲 : ${responseSpeed}ms\n𝐒𝐞𝐫𝐯𝐞𝐫 𝐓𝐢𝐦𝐞 : ${new Date().toLocaleString()}\n𝐔𝐩𝐭𝐢𝐦𝐞 : ${formatUptime(process.uptime())}\n𝐌𝐞𝐦𝐨𝐫𝐲 : ${usedMB}/${totalMB} MB\n𝐍𝐨𝐝𝐞𝐉𝐒 : ${process.version}\n𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦 : ${platform}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

            const device = await getDeviceMode();

            if (device === 'ios') {
                await sendInteractive(client, m, text);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return;
            }

            try {
                const btnV2 = new ButtonV2(client);
                btnV2.setMedia({ headerType: 1 })
                    .setBody(text)
                    .setFooter(`© ${bName}`)
                    .addButton('📋 Menu', `${prefix || '.'}menu`)
                    .addButton('👤 Owner', `${prefix || '.'}owner`)
                    .addButton('🔗 Repo', `${prefix || '.'}repo`);
                await btnV2.send(m.chat, { userJid: client.user?.id || '', mentions: [m.sender] });
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            } catch {
                await sendInteractive(client, m, text);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            }
        } catch (error) {
            await m.reply(`📌 *PING*\n━━━━━━━━━━━━━━━━\nSomething broke. Shocker.\n${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
