import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getSettings, getSudoUsers, removeSudoUser } from '../../database/config.js';
import { resolvePhoneNumber } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, participants } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        let numberToRemove;

        if (m.quoted) {
            numberToRemove = resolvePhoneNumber(m.quoted.sender, participants);
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToRemove = resolvePhoneNumber(m.mentionedJid[0], participants);
        } else {
            numberToRemove = args[0];
        }

        if (!numberToRemove || !/^\d+$/.test(numberToRemove)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `📌 *DELSUDO*\n━━━━━━━━━━━━━━━━\nProvide a valid number or quote a user, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const settings = await getSettings();
        if (!settings) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `📌 *DELSUDO*\n━━━━━━━━━━━━━━━━\nSettings not found. Something's seriously broken.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const sudoUsers = await getSudoUsers();

        if (!sudoUsers.includes(numberToRemove)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `📌 *DELSUDO*\n━━━━━━━━━━━━━━━━\nThis number isn't even a sudo user, idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        await removeSudoUser(numberToRemove);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await sendInteractive(client, m, `📌 *DELSUDO*\n━━━━━━━━━━━━━━━━\n${numberToRemove} removed from Sudo Users.\nPower revoked. Sucks to be them.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    });
};
