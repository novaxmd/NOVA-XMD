import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {

const { client, m, text, botname } = context;
await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });



try {
let cap = `📌 *SCREENSHOT*\n━━━━━━━━━━━━━━━━\nScreenshot by ${botname}\n━━━━━━━━━━━━━━━━\n© bmb tech`

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `📌 *USAGE*\n━━━━━━━━━━━━━━━━\nProvide a website link to screenshot, moron.\n━━━━━━━━━━━━━━━━\n© bmb tech`)
}

const url = /^https?:\/\//i.test(text) ? text : `https://${text}`;
const image = `https://image.thum.io/get/fullpage/${url}`

await client.sendMessage(m.chat, { image: { url: image }, caption: cap});


} catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nScreenshot failed. Probably your garbage link.\n━━━━━━━━━━━━━━━━\n© bmb tech`)

}

}
