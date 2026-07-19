import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { sendInteractive } from '../../lib/sendInteractive.js';

const execAsync = promisify(exec);

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const cmd = (text || (m.quoted && (m.quoted.text || m.quoted.caption)) || '').trim();

        if (!cmd) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *EXEC*\n━━━━━━━━━━━━━━━━\nNo command provided. Provide a\nvalid shell command, fool.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        try {
            const { stdout, stderr } = await execAsync(cmd, { timeout: 30000 });
            const output = stdout || stderr || '(no output)';
            await client.sendMessage(m.chat, { react: { text: stderr && !stdout ? '❌' : '✅', key: m.reactKey } });
            await sendInteractive(client, m, `💻 *SHELL OUTPUT*\n━━━━━━━━━━━━━━━━\n${output.split('\n').join('\n')}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *SHELL ERROR*\n━━━━━━━━━━━━━━━━\n${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    });
};
