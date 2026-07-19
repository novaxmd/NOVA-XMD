const DEV_NUMBER = '255767862457';

const normalizeNumber = (jid) => {
    if (!jid) return '';
    return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
};

const middleware = async (context, next) => {
    const { m, isBotAdmin, client } = context;
    const isDev = normalizeNumber(m.sender) === normalizeNumber(DEV_NUMBER);

    if (!m.isGroup) {
        return m.reply(`👥 *GROUP ONLY*\n━━━━━━━━━━━━━━━━\nThis command isn't for lone wolves.\nTry again in a group, you loner.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
    if (!isDev && !context.isAdmin) {
        return m.reply(`👮 *NOT ADMIN*\n━━━━━━━━━━━━━━━━\nYou think you're worthy?\nAdmin privileges are required—\ngo beg for them, peasant.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    let resolvedIsBotAdmin = isBotAdmin;

    if (!resolvedIsBotAdmin && m.isGroup && client) {
        try {
            const botRawJid = client.user?.id || '';
            const botNum = botRawJid.split('@')[0].split(':')[0].replace(/\D/g, '');
            const meta = await client.groupMetadata(m.chat);
            const participants = meta?.participants || [];
            for (const p of participants) {
                const pJid = p.id || p.jid || '';
                const pNum = pJid.split('@')[0].split(':')[0].replace(/\D/g, '');
                const isAdminRole = p.admin === 'admin' || p.admin === 'superadmin';
                if (isAdminRole && pNum && botNum && (pNum === botNum || pNum.endsWith(botNum) || botNum.endsWith(pNum))) {
                    resolvedIsBotAdmin = true;
                    break;
                }
            }
        } catch {}
    }

    if (!resolvedIsBotAdmin) {
        return m.reply(`👮 *BOT NOT ADMIN*\n━━━━━━━━━━━━━━━━\nI need admin rights to obey,\nunlike you who blindly follows.\nMake me admin first, idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    await next();
};

export default middleware;
