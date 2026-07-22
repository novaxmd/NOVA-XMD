import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
  name: 'script',
  aliases: ['repo', 'source', 'github', 'git', 'gh', 'src', 'code', 'sourcecode'],
  description: 'Show GitHub repository info for NOVA-XMD',
  run: async (context) => {
    const { client, m, botname, prefix = '' } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
      const repoUrl = 'https://api.github.com/repos/novaxmd/NOVA-XMD';
      const response = await fetch(repoUrl);
      const repoData = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch repository data');
      }

      const repoInfo = {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        lastUpdate: repoData.updated_at,
        owner: repoData.owner.login,
        createdAt: repoData.created_at,
        htmlUrl: repoData.html_url
      };

      const createdDate = new Date(repoInfo.createdAt).toLocaleDateString('en-GB');
      const lastUpdateDate = new Date(repoInfo.lastUpdate).toLocaleDateString('en-GB');

      const replyText = `📌 *REPOSITORY*\n━━━━━━━━━━━━━━━━\n🔗 GitHub:\nhttps://github.com/novaxmd/NOVA-XMD\n🌐 MainBot Site:\nhttps://bmbtech.site\n⭐ Stars : ${repoInfo.stars}\n🍴 Forks : ${repoInfo.forks}\n📅 Created : ${createdDate}\n🔄 Last Update : ${lastUpdateDate}\n👤 Owner : ${repoInfo.owner}\n━━━━━━━━━━━━━━━━\n© bmb tech
> tech`;

      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

      try {
        const msg = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
          interactiveMessage: {
            body: { text: replyText },
            footer: { text: '©bmb tech' },
            header: { hasMediaAttachment: false },
            contextInfo: {
              externalAdReply: {
                showAdAttribution: false,
                title: `${botname}`,
                body: `Bmb-Project🟩`,
                sourceUrl: `https://©bmb tech`,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'GitHub Repo',
                    url: repoInfo.htmlUrl,
                    merchant_url: repoInfo.htmlUrl
                  })
                },
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Open-Bmb-Project',
                    url: 'https://©bmb tech',
                    merchant_url: 'https://©bmb tech'
                  })
                }
              ]
            }
          }
        }), { userJid: client.user.id });
        await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      } catch {
        await client.sendMessage(m.chat, {
          text: replyText,
          viewOnce: true,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: false,
              title: `${botname}`,
              body: `Bmb-Project`,
              sourceUrl: `https://©bmb tech`,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        });
      }

    } catch (error) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nCouldn't fetch repo data\n${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
  }
};
