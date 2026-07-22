import axios from 'axios';
import { herokuAppName, getHerokuApiKey } from '../../config/settings.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js'; 
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const herokuApiKey = getHerokuApiKey();
        const { client, m, text, Owner, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!herokuAppName || !herokuApiKey) {
            await sendInteractive(client, m, "📌 *SETVAR*\n━━━━━━━━━━━━━━━━\nHeroku app name or API key not set, you clown.\nSet HEROKU_APP_NAME and HEROKU_API_KEY first!\n━━━━━━━━━━━━━━━━\n© bmb tech");
            return;
        }

        if (!text) {
            await sendInteractive(client, m, `📌 *SETVAR*\n━━━━━━━━━━━━━━━━\nProvide a var and value, moron.\nFormat: ${prefix}setvar VAR_NAME=VALUE\nExample: ${prefix}setvar MYCODE=254\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            return;
        }

        async function setHerokuConfigVar(varName, value) {
            try {
                const response = await axios.patch(
                    `https://api.heroku.com/apps/${herokuAppName}/config-vars`,
                    {
                        [varName]: value
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${herokuApiKey}`,
                            Accept: "application/vnd.heroku+json; version=3" } }
                );

                if (response.status === 200) {
                    await sendInteractive(client, m, `📌 *SETVAR*\n━━━━━━━━━━━━━━━━\n${varName} updated to "${value}"\nWait 2min for bot to restart, be patient.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                } else {
                    await sendInteractive(client, m, "│ Failed to update the config var. Try again, loser.\n╰───────────────\n> ©BMB TECH");
                }
            } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                const errorMessage = error.response?.data || error.message;
                await sendInteractive(client, m, `❌ *HEROKU ERROR*\n━━━━━━━━━━━━━━━━\nFailed to set config var.\n${errorMessage}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                console.error("Error updating config var:", errorMessage);
            }
        }

        const parts = text.split("=");
        if (parts.length !== 2) {
            await sendInteractive(client, m, `📌 *SETVAR*\n━━━━━━━━━━━━━━━━\nInvalid format, you illiterate fool.\nUse: ${prefix}setvar VAR_NAME=VALUE\nExample: ${prefix}setvar MYCODE=254\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            return;
        }

        const varName = parts[0].trim();
        const value = parts[1].trim();

        await setHerokuConfigVar(varName, value);
    });
};
