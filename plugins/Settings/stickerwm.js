import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const newStickerWM = args.join(" ") || null;  

        let settings = await getSettings();

        if (!settings) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `🌟 *STICKER WM*\n━━━━━━━━━━━━━━━━\nSettings not found. Something's seriously broken.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        if (newStickerWM !== null) {
            if (newStickerWM === 'null') {
                if (!settings.packname) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await sendInteractive(client, m, `🌟 *STICKER WM*\n━━━━━━━━━━━━━━━━\nBot already has no sticker watermark, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                }
                await updateSetting('packname', '');
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await sendInteractive(client, m, `🌟 *STICKER WM*\n━━━━━━━━━━━━━━━━\nSticker watermark removed. Happy now?\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            } else {
                if (settings.packname === newStickerWM) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await sendInteractive(client, m, `🌟 *STICKER WM*\n━━━━━━━━━━━━━━━━\nWatermark already set to: ${newStickerWM}\nStop wasting my time.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                }
                await updateSetting('packname', newStickerWM);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await sendInteractive(client, m, `🌟 *STICKER WM*\n━━━━━━━━━━━━━━━━\nWatermark updated to: ${newStickerWM}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        } else {
            await sendInteractive(client, m, `🌟 *STICKER WM*\n━━━━━━━━━━━━━━━━\nCurrent watermark: ${settings.packname || 'None set'}\nUse '${settings.prefix}stickerwm null' to remove\nUse '${settings.prefix}stickerwm <text>' to set\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    });
};
