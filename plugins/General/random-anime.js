import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


  const link = "https://api.jikan.moe/v4/random/anime";

  try {
    const response = await axios.get(link);
    const data = response.data.data;

    const title = data.title;
    const synopsis = data.synopsis;
    const imageUrl = data.images.jpg.image_url;
    const episodes = data.episodes;
    const status = data.status;

    const message = `🎨 *RANDOM ANIME*\n━━━━━━━━━━━━━━━━\nTitle: ${title}\nEpisodes: ${episodes}\nStatus: ${status}\nSynopsis: ${synopsis}\nURL: ${data.url}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: message });
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
   sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nAn error occurred fetching anime.\nTry again, weeb.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }

}
