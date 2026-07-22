import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js'; 
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, participants, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!botname) {
            console.error(`Botname not set, you incompetent fuck.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *LEAVEGC*\n━━━━━━━━━━━━━━━━\nBot's fucked. No botname in context.\nYell at your dev, dumbass.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        if (!Owner) {
            console.error(`Owner not set, you brain-dead moron.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *LEAVEGC*\n━━━━━━━━━━━━━━━━\nBot's broken. No owner in context.\nGo cry to the dev.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *LEAVEGC*\n━━━━━━━━━━━━━━━━\nYou think I'm bailing on your\npathetic DMs? This is for groups,\nyou idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        try {
            const maxMentions = 50;
            const mentions = participants.slice(0, maxMentions).map(a => a.id);
            await client.sendMessage(m.chat, { 
                text: `📌 *LEAVING*\n━━━━━━━━━━━━━━━━\nFuck this shithole ${botname} is OUT!\nGood luck rotting without me,\nyou nobodies. ${mentions.length < participants.length ? 'Too many losers to tag, pathetic.' : ''}\n━━━━━━━━━━━━━━━━\n© bmb tech`, 
                mentions 
            });
            console.log(`[LEAVE-DEBUG] Leaving group ${m.chat}, mentioned ${mentions.length} participants`);
            await client.groupLeave(m.chat);
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.error(`[LEAVE-ERROR] Couldn't ditch the group: ${error.stack}`);
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nShit broke, @${m.sender.split('@')[0].split(':')[0]}!\nCan't escape this dumpster fire:\n${error.message}. Try again, loser.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    });
};
