import wiki from 'wikipedia';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {

const { client, m, text } = context;
await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });




        try {
            if (!text) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `📌 *USAGE*\n━━━━━━━━━━━━━━━━\nProvide a term to search, you lazy fool.\nE.g: What is JavaScript!\n━━━━━━━━━━━━━━━━\n© bmb tech`)
            }
            const con = await wiki.summary(text);
            const texa = `📌 *WIKIPEDIA*\n━━━━━━━━━━━━━━━━\nTitle: ${con.title}\nDesc: ${con.description}\nSummary: ${con.extract}\nURL: ${con.content_urls.mobile.page}\n━━━━━━━━━━━━━━━━\n© bmb tech`
            sendInteractive(client, m, texa)
        } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.log(err)
            return sendInteractive(client, m, `📌 *WIKI*\n━━━━━━━━━━━━━━━━\nGot 404. Couldn't find anything, try harder.\n━━━━━━━━━━━━━━━━\n© bmb tech`)
        }
    }
