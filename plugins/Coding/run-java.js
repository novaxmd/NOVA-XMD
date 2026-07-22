import { c, cpp, node, python, java } from 'compile-run';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
    const { m } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


    if (m.quoted && m.quoted.text) {
        const code = m.quoted.text;

async function runCode() {
  try {
    let result = await java.runSource(code);
    console.log(result);
    sendInteractive(client, m, `💻 *JAVA OUTPUT*\n━━━━━━━━━━━━━━━━\n${result.stdout || 'No output'}\n${result.stderr ? 'stderr: ' + result.stderr + '\n' : ''}━━━━━━━━━━━━━━━━\n© bmb tech`);
  } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.log(err);
    sendInteractive(client, m, `❌ *JAVA ERROR*\n━━━━━━━━━━━━━━━━\n${err.stderr || err.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }
}

runCode();

} else { 

sendInteractive(client, m, `📌 *JAVA COMPILER*\n━━━━━━━━━━━━━━━━\nQuote a valid and short Java code\nto compile, you absolute walnut.\n━━━━━━━━━━━━━━━━\n© bmb tech`)

}

}