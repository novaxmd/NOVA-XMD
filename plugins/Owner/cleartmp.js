import { readdirSync, statSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'cleartmp',
    alias: ['clearcache', 'clrtmp'],
    description: 'Delete all temporary files (Owner only)',
    run: async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m } = context;
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const tmpDirs = ['./tmp', './temp'].filter(d => existsSync(d));
            if (!tmpDirs.length) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `📌 *CLEARTMP*\n━━━━━━━━━━━━━━━━\nNo tmp directories found.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            let deleted = 0;
            let skipped = 0;
            for (const dir of tmpDirs) {
                for (const file of readdirSync(dir)) {
                    const fp = join(dir, file);
                    try {
                        if (statSync(fp).isFile()) { unlinkSync(fp); deleted++; }
                        else { skipped++; }
                    } catch { skipped++; }
                }
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *TMP CLEANED*\n━━━━━━━━━━━━━━━━\n✅ Deleted: ${deleted} file(s)\n⏩ Skipped: ${skipped} item(s)\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        });
    }
};
