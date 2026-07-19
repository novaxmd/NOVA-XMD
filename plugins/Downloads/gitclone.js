import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {

  const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `📌 *GITCLONE*\n━━━━━━━━━━━━━━━━\nWhere's the link, you forgetful moron?\n━━━━━━━━━━━━━━━━\n© bmb tech`)
  }
  if (!text.includes('github.com')) return sendInteractive(client, m, `📌 *GITCLONE*\n━━━━━━━━━━━━━━━━\nIs that even a GitHub repo link?! Think again.\n━━━━━━━━━━━━━━━━\n© bmb tech`)

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  try {
      let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
      let [, user3, repo] = text.match(regex1) || []
      repo = repo.replace(/.git$/, '')
      let url = `https://api.github.com/repos/${user3}/${repo}/zipball`
      let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
      await client.sendMessage(m.chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' })
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
  } catch (err) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nGit clone failed. Skill issue.\n━━━━━━━━━━━━━━━━\n© bmb tech`)
  }

  }