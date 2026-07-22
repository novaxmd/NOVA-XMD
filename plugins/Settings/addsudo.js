import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getSudoUsers, addSudoUser } from '../../database/config.js';
import { resolvePhoneNumber } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, participants } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        let numberToAdd;

        if (m.quoted) {
            numberToAdd = resolvePhoneNumber(m.quoted.sender, participants);
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            numberToAdd = resolvePhoneNumber(m.mentionedJid[0], participants);
        } else {
            numberToAdd = (args[0] || '').replace(/[^0-9]/g, '');
        }

        if (!numberToAdd || !/^\d+$/.test(numberToAdd)) {
            return sendInteractive(client, m, `📌 *ADD SUDO*\n━━━━━━━━━━━━━━━━\nGive me a valid number or quote a user, fool!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const sudoUsers = await getSudoUsers();
        if (sudoUsers.includes(numberToAdd)) {
            return sendInteractive(client, m, `📌 *ADD SUDO*\n━━━━━━━━━━━━━━━━\nAlready a sudo user, you clueless twit!\n${numberToAdd} is already in the elite ranks.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        await addSudoUser(numberToAdd);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        return sendInteractive(client, m, `📌 *ADD SUDO*\n━━━━━━━━━━━━━━━━\nBow down!\n${numberToAdd} is now a Sudo King!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    });
};
