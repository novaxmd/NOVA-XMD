import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter';let canvacord = null; try { canvacord = (await import("canvacord")).default ?? (await import("canvacord")); } catch {}
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
        const { client, m, Tag, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

let cap = `📌 *WASTED*\n━━━━━━━━━━━━━━━━\nConverted By ${botname}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.wasted(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.wasted(ppuser);
        } 


        let sticker = new Sticker(result, {
            pack: `Triggred`,
            author:"" ,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 75,
            background: 'transparent'
        })
        const stikk = await sticker.toBuffer()
       await client.sendMessage(m.chat, {sticker: stikk})
       await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

} catch (e) {

await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nSomething wrong occured.\nTry again, loser.\n━━━━━━━━━━━━━━━━\n© bmb tech`)

}
    }