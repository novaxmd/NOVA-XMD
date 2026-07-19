import { sendInteractive } from '../../lib/sendInteractive.js';
let canvacord = null; try { canvacord = (await import("canvacord")).default ?? (await import("canvacord")); } catch {}

export default async (context) => {
        const { client, m, Tag, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

let cap = `📌 *TRASH*\n━━━━━━━━━━━━━━━━\nConverted By ${botname}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.trash(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.trash(ppuser);
        } 


        await client.sendMessage(m.chat, { image: result, caption: cap });

} catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nSomething wrong occured.\nTry again, loser.\n━━━━━━━━━━━━━━━━\n© bmb tech`)

}
    }