import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!text) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `📌 *CODEGEN*\n━━━━━━━━━━━━━━━━\nExample usage:\n.codegen Function to calculate triangle area|Python\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    let [prompt, language] = text.split("|").map(v => v.trim());

    if (!prompt || !language) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nInvalid format!\nUse the format: .codegen <prompt>|<language>\nExample: .codegen Check for prime number|JavaScript\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    try {
        const payload = {
            customInstructions: prompt,
            outputLang: language
        };

        const { data } = await axios.post("https://www.codeconvert.ai/api/generate-code", payload);

        if (!data || typeof data !== "string") {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to retrieve code from API.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        sendInteractive(client, m, `🤖 *CODEGEN (${language})*\n━━━━━━━━━━━━━━━━\n` + "```" + language.toLowerCase() + "\n" + data.trim() + "\n```" + `\n━━━━━━━━━━━━━━━━\n© bmb tech`);

    } catch (error) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        console.error(error);
        sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nAn error occurred while processing your request.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};