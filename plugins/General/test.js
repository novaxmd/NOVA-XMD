import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sendInteractive } from '../../lib/sendInteractive.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  name: 'test',
  aliases: ['tst', 'testcmd'],
  description: 'Sends a test voice note to check if you\'re worthy',
  run: async (context) => {
    const { client, m, botname, text } = context;

    if (text) {
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      return client.sendMessage(m.chat, { text: `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nYo, @${m.sender.split('@')[0].split(':')[0]}, what's this extra\ngarbage? Just say .test, you clown.\n━━━━━━━━━━━━━━━━\n© bmb tech` }, { mentions: [m.sender] });
    }

    try {
      const possibleAudioPaths = [
        path.join(__dirname, 'bmb_tech', 'test.mp3'),
        path.join(process.cwd(), 'bmb_tech', 'test.mp3'),
        path.join(__dirname, '..', 'bmb_tech', 'test.mp3'),
      ];

      let audioPath = null;
      for (const possiblePath of possibleAudioPaths) {
        if (fs.existsSync(possiblePath)) {
          audioPath = possiblePath;
          break;
        }
      }

      if (audioPath) {
        console.log(`✅ Found audio file at: ${audioPath}`);
        await client.sendMessage(m.chat, {
          audio: { url: audioPath },
          ptt: true,
          mimetype: 'audio/mpeg',
          fileName: 'test.mp3'
        });
      } else {
        console.error('❌ Audio file not found at any of the following paths:', possibleAudioPaths);
        await sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nShit, couldn't find test.mp3 in\nbmb_tech/. Fix your files, you slacker.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
      }
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error('Error in test command:', error);
      await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nYo, something fucked up the test\naudio. Try again later, dumbass.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
  }
};
