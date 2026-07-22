import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

if (!globalThis.stickerlySession) globalThis.stickerlySession = {};

async function searchStickerly(keyword) {
  try {
    const { data } = await axios.post(
      'https://api.sticker.ly/v4/stickerPack/smartSearch',
      {
        keyword,
        enabledKeywordSearch: true,
        filter: {
          extendSearchResult: false,
          sortBy: 'RECOMMENDED',
          languages: ['ALL'],
          minStickerCount: 5,
          searchBy: 'ALL',
          stickerType: 'ALL'
        }
      },
      {
        headers: {
          'User-Agent': 'androidapp.stickerly/3.31.0 (M2006C3LG; U; Android 29; in-ID; id;)',
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const packs = data?.result?.stickerPacks || data?.stickerPacks || data?.data || [];
    return packs.map(v => ({
      id: v.packId,
      name: v.name,
      author: v.authorName || 'Unknown',
      count: v.resourceFiles?.length || 0,
      animated: v.isAnimated,
      prefix: v.resourceUrlPrefix,
      files: v.resourceFiles || [],
      url: v.shareUrl || `https://sticker.ly/s/${v.packId}`
    }));
  } catch (e) {
    console.log('Stickerly Search Error:', e.message);
    return [];
  }
}

export default {
  name: 'stickersearch',
  aliases: ['stickersearch', 'stick', 'stickers', 'stickerly'],
  description: 'Search Sticker.ly packs and send one as a native WhatsApp sticker pack',
  run: async (context) => {
    const { client, m, text } = context;

    if (!text) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `🌟 *STICKERSEARCH*\n━━━━━━━━━━━━━━━━\nGive me a search term.\nExample: .stickersearch patrick\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    const packs = await searchStickerly(text);
    if (!packs.length) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `🌟 *STICKERSEARCH*\n━━━━━━━━━━━━━━━━\nNo sticker packs found for "${text}".\nTry a different search term.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    const top = packs.slice(0, 10);
    globalThis.stickerlySession[m.sender] = { chat: m.chat, packs: top, expiresAt: Date.now() + 5 * 60 * 1000 };

    let list = `🌟 *STICKER SEARCH*\n━━━━━━━━━━━━━━━━\n`;
    top.forEach((v, i) => {
      list += `${i + 1}. ${v.name}\n   Author: ${v.author} • Stickers: ${v.count}\n`;
    });
    list += `\nReply with a number (1-${top.length}) to send that pack.\n━━━━━━━━━━━━━━━━\n© bmb tech`;

    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    await sendInteractive(client, m, list);
  }
};
