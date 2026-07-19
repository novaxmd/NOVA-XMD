import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const SENSITIVE = ['heroku_api_key', 'api_key', 'database_url', 'session', 'secret', 'password', 'token', 'private_key', 'auth', 'key'];

function isSensitive(key) {
    const lk = key.toLowerCase();
    return SENSITIVE.some(s => lk.includes(s));
}

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const herokuApiKey = getHerokuApiKey();

        if (!herokuAppName || !herokuApiKey) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, "📌 *HEROKU VARS*\n━━━━━━━━━━━━━━━━\nHEROKU_APP_NAME or HEROKU_API_KEY not set.\n━━━━━━━━━━━━━━━━\n© bmb tech");
        }

        try {
            const response = await axios.get(`https://api.heroku.com/apps/${herokuAppName}/config-vars`, {
                headers: { Authorization: `Bearer ${herokuApiKey}`, Accept: "application/vnd.heroku+json; version=3" }
            });

            const configVars = response.data;
            if (!configVars || Object.keys(configVars).length === 0) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return await sendInteractive(client, m, "📌 *HEROKU VARS*\n━━━━━━━━━━━━━━━━\nNo config vars found.\n━━━━━━━━━━━━━━━━\n© bmb tech");
            }

            let msg = `📌 *HEROKU VARS*\n━━━━━━━━━━━━━━━━\n`;
            for (const [key, value] of Object.entries(configVars)) {
                msg += `${key}: ${isSensitive(key) ? '**REDACTED**' : value}\n`;
            }
            msg += "━━━━━━━━━━━━━━━━\n© bmb tech";

            const dmJid = typeof m.sender === 'string' && m.sender.endsWith('@s.whatsapp.net') ? m.sender : null;
            if (dmJid) {
                await client.sendMessage(dmJid, { text: msg });
                await sendInteractive(client, m, "📌 *HEROKU VARS*\n━━━━━━━━━━━━━━━━\nVars sent to your DM only. 🔒\nSensitive keys are always redacted.\n━━━━━━━━━━━━━━━━\n© bmb tech");
            } else {
                await sendInteractive(client, m, "📌 *HEROKU VARS*\n━━━━━━━━━━━━━━━━\nCouldn't resolve your JID for DM.\nUse this command from DM only.\n━━━━━━━━━━━━━━━━\n© bmb tech");
            }
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await sendInteractive(client, m, `📌 *HEROKU VARS*\n━━━━━━━━━━━━━━━━\nFailed to fetch config vars.\n${error.response?.data || error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    });
};
