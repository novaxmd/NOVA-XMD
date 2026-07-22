import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
    const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    function convertTimestamp(timestamp) {
        const d = new Date(timestamp * 1000);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return {
            date: d.getDate(),
            month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d),
            year: d.getFullYear(),
            day: daysOfWeek[d.getUTCDay()],
            time: `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')}`
        }
    }

    if (!m.isGroup) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nThis command is meant for groups.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    let info = await client.groupMetadata(m.chat);
    let ts = await convertTimestamp(info.creation);

    try {
        var pp = await client.profilePictureUrl(m.chat, 'image');
    } catch {
        var pp = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
    }

    const membersCount = info.participants.filter(p => !p.admin).length;
    const adminsCount = info.participants.filter(p => p.admin).length;
    const owner = info.owner || info.participants.find(p => p.admin === 'superadmin')?.id;

    const caption = `👥 *GROUP INFO*\n━━━━━━━━━━━━━━━━\nName : *${info.subject}*\nID : *${info.id}*\nOwner : ${owner ? '@' + owner.split('@')[0] : 'Unknown'}\nCreated :\n${ts.day}, ${ts.date} ${ts.month} ${ts.year}\n${ts.time} UTC\nParticipants :\nTotal : *${info.size}*\nMembers : *${membersCount}*\nAdmins : *${adminsCount}*\nSettings :\nMessages : ${info.announce ? 'Admins Only' : 'Everyone'}\nEdit Info : ${info.restrict ? 'Admins Only' : 'Everyone'}\nAdd Members : ${info.memberAddMode ? 'Everyone' : 'Admins Only'}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

    await client.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: caption
    });
    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
};
