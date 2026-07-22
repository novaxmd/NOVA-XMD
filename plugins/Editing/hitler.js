import { sendInteractive } from '../../lib/sendInteractive.js';
let canvacord = null; try { canvacord = (await import("canvacord")).default ?? (await import("canvacord")); } catch {}

export default async (context) => {
        const { client, m, Tag, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

let cap = `📌 *HITLER*\n━━━━━━━━━━━━━━━━\nConverted By ${botname}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

try {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg"
            }
                        result = await canvacord.Canvacord.hitler(img);
        } else if (Tag) {
            try {
                ppuser = await client.profilePictureUrl(Tag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg'
            }
                        result = await canvacord.Canvacord.hitler(ppuser);
        } 


        await client.sendMessage(m.chat, { image: result, caption: cap });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

} catch (e) {

await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nSomething wrong occured.\nTry again, loser.\n━━━━━━━━━━━━━━━━\n© bmb tech`)

}
    }