import { c, cpp, node, python, java } from 'compile-run';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
    const { client, m } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


    if (m.quoted && m.quoted.text) {
        const code = m.quoted.text;

async function runCode() {
  try {
    let result = await python.runSource(code);
    console.log(result);
    sendInteractive(client, m, `💻 *PYTHON OUTPUT*\n━━━━━━━━━━━━━━━━\n${result.stdout || 'No output'}\n${result.stderr ? 'stderr: ' + result.stderr + '\n' : ''}━━━━━━━━━━━━━━━━\n© bmb tech`);
  } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.log(err);
    sendInteractive(client, m, `❌ *PYTHON ERROR*\n━━━━━━━━━━━━━━━━\n${err.stderr || err.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }
}

runCode();

} else { 

sendInteractive(client, m, `📌 *PYTHON COMPILER*\n━━━━━━━━━━━━━━━━\nQuote a valid and short Python code\nto compile, you absolute walnut.\n━━━━━━━━━━━━━━━━\n© bmb tech`)

}

}
