import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'npm',
    aliases: ['npmdownload', 'npminstall'],
    description: 'Download NPM package as .tgz file',
    run: async (context) => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            let query = (text || '').trim();
            if (!query) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nProvide a package name,\nyou incompetent fool.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            if (query.startsWith('@') && !query.includes('/')) {
                const searchRes = await fetch(`https://yaemiko-narukami.vercel.app/search/npm?text=${encodeURIComponent(query)}`);
                const searchData = await searchRes.json();
                
                const list = searchData?.result || searchData?.results || searchData?.data || [];
                if (!Array.isArray(list) || list.length === 0) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nNo packages found in scope *${query}*\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                }
                
                query = list[0]?.name || list[0]?.package?.name || query;
            }

            const npmRes = await fetch(`https://registry.npmjs.org/${encodeURIComponent(query)}`);
            const data = await npmRes.json();
            
            const latest = data["dist-tags"]?.latest;
            if (!latest) throw new Error('No latest version found');
            
            const tarball = data.versions?.[latest]?.dist?.tarball;
            if (!tarball) throw new Error('No download link found');

            const fileRes = await fetch(tarball);
            const fileBuffer = await fileRes.arrayBuffer();
            
            const fileName = `${query.replace(/\//g, '-')}-${latest}.tgz`;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            
            await client.sendMessage(m.chat, {
                document: Buffer.from(fileBuffer),
                fileName: fileName,
                mimetype: 'application/gzip',
                caption: `📌 *NPM*\n━━━━━━━━━━━━━━━━\n${query} v${latest}\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });

        } catch (error) {
            console.error('NPM download error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nDownload failed.\nError: ${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
