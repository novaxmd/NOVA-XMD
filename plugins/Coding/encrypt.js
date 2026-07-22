import Obf from 'javascript-obfuscator';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
    const { client, m } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


    
    if (m.quoted && m.quoted.text) {
        const forq = m.quoted.text;

       
        const obfuscationResult = Obf.obfuscate(forq, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        });

        console.log("Successfully encrypted the code");
        sendInteractive(client, m, `📌 *ENCRYPTED*\n━━━━━━━━━━━━━━━━\n${obfuscationResult.getObfuscatedCode()}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    } else {
        sendInteractive(client, m, `📌 *ENCRYPT*\n━━━━━━━━━━━━━━━━\nTag a valid JavaScript code to encrypt!\nStop wasting my time.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};