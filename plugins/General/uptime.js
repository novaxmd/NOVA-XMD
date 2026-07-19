import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  const { client, m, text, botname } = context;

  if (text) {
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nWhat's with the extra crap, @${m.sender.split('@')[0].split(':')[0]}?\nJust say uptime, dumbass.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }

  try {
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      const daysDisplay = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}, ` : '';
      const hoursDisplay = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}, ` : '';
      const minutesDisplay = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, ` : '';
      const secsDisplay = secs > 0 ? `${secs} ${secs === 1 ? 'second' : 'seconds'}` : '';
      return (daysDisplay + hoursDisplay + minutesDisplay + secsDisplay).replace(/,\s*$/, '');
    };

    const uptimeText = formatUptime(process.uptime());
    const replyText = `📌 *UPTIME*\n━━━━━━━━━━━━━━━━\n*${botname || 'NOVA-XMD'} Uptime, Bitches*\nI've been awake for *${uptimeText}*,\nrunning shit like a boss.\n━━━━━━━━━━━━━━━━\n© bmb tech`;
    await sendInteractive(client, m, replyText);
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nSomething's fucked up with the\nuptime check. Try again later, loser.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }
};
