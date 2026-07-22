import axios from 'axios';
import * as cheerio from 'cheerio';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {

const { client, m, text, botname  } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


async function MediaFire(url, options) {
  try {
    let mime;
    options = options ? options : {};
    const res = await axios.get(url, options);
    const $ = cheerio.load(res.data);
    const hasil = [];
    const link = $('a#downloadButton').attr('href');
    const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '');
    const seplit = link.split('/');
    const nama = seplit[5];
    mime = nama.split('.');
    mime = mime[1];
    hasil.push({ nama, mime, size, link });
    return hasil;
  } catch (err) {
    return err;
  }
}

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, "📌 *MEDIAFIRE*\n━━━━━━━━━━━━━━━━\nProvide a MediaFire link, you lazy bum!\n━━━━━━━━━━━━━━━━\n© bmb tech");
}

if (!text.includes('mediafire.com')) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, "📌 *MEDIAFIRE*\n━━━━━━━━━━━━━━━━\nThat doesn't look like a MediaFire link, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech");
    }


await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

try {

        const fileInfo = await MediaFire(text);



if (!fileInfo || !fileInfo.length) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, "│ File no longer exists on MediaFire. Too slow!\n╰───────────────\n> ©BMB TECH");
}






        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await client.sendMessage(
            m.chat,
            {
                document: {
                    url: fileInfo[0].link },
                fileName: fileInfo[0].nama,
                mimetype: fileInfo[0].mime,
                caption: `📥 *MEDIAFIRE DL*\n━━━━━━━━━━━━━━━━\nFile: ${fileInfo[0].nama}\nDownloaded by ${botname}\n━━━━━━━━━━━━━━━━\n© bmb tech` }


   );

} catch (error) {

        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        sendInteractive(client, m, `❌ *MEDIAFIRE ERROR*\n━━━━━━━━━━━━━━━━\nDownload failed, not my fault.\n${error}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

}
