const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const { getAnti, setAnti, initializeAntiDeleteconfig } = require('../data/antidel');

// Newsletter context
const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "𝙱.𝙼.𝙱 𝚃𝙴𝙲𝙃 ✅"
    }
  }
};

// Contact message for verified context
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255 767 862457\nEND:VCARD"
    }
  }
};

// Initialize AntiDelete config
initializeAntiDeleteconfig();

// ─── AntiDelete Command ─────────────────────────────
cmd({
  pattern: "antidelete",
  alias: ['antidel', 'ad'],
  desc: "Sets up the Antidelete feature.",
  category: "misc",
  filename: __filename
},
async (conn, mek, m, { from, reply, q, isCreator }) => {
  if (!isCreator) return reply('⚠️ This command is only for the bot owner. ⚠️');

  try {
    const command = q?.toLowerCase();

    switch (command) {
      case 'on':
        await setAnti('gc', true);
        await setAnti('dm', true);
        return await conn.sendMessage(from, { 
          text: "✅ AntiDelete has been ENABLED for Group Chats and Direct Messages." 
        }, { quoted: quotedContact, ...newsletterContext });

      case 'off gc':
        await setAnti('gc', false);
        return await conn.sendMessage(from, { 
          text: "❌ AntiDelete for Group Chats is now DISABLED." 
        }, { quoted: quotedContact, ...newsletterContext });

      case 'off dm':
        await setAnti('dm', false);
        return await conn.sendMessage(from, { 
          text: "❌ AntiDelete for Direct Messages is now DISABLED." 
        }, { quoted: quotedContact, ...newsletterContext });

      case 'set gc':
        const gcStatus = await getAnti('gc');
        await setAnti('gc', !gcStatus);
        return await conn.sendMessage(from, { 
          text: `🔁 AntiDelete for Group Chats is now ${!gcStatus ? 'ENABLED' : 'DISABLED'}.` 
        }, { quoted: quotedContact, ...newsletterContext });

      case 'set dm':
        const dmStatus = await getAnti('dm');
        await setAnti('dm', !dmStatus);
        return await conn.sendMessage(from, { 
          text: `🔁 AntiDelete for Direct Messages is now ${!dmStatus ? 'ENABLED' : 'DISABLED'}.` 
        }, { quoted: quotedContact, ...newsletterContext });

      case 'set all':
        await setAnti('gc', true);
        await setAnti('dm', true);
        return await conn.sendMessage(from, { 
          text: "✅ AntiDelete has been ENABLED for all chats." 
        }, { quoted: quotedContact, ...newsletterContext });

      case 'status':
        const currentGc = await getAnti('gc');
        const currentDm = await getAnti('dm');
        return await conn.sendMessage(from, {
          text: `🔍 _AntiDelete Status:_\n\n*DM AntiDelete:* ${currentDm ? '✅ ENABLED' : '❌ DISABLED'}\n*Group Chat AntiDelete:* ${currentGc ? '✅ ENABLED' : '❌ DISABLED'}`
        }, { quoted: quotedContact, ...newsletterContext });

      default:
        return await conn.sendMessage(from, {
          text: `╭───〔 *🛡️ ANTIDELETE HELP* 〕───⬣
│
│ 🔘 \`\`.antidelete on\`\` - Enable for all
│ ❌ \`\`.antidelete off gc\`\` - Disable in groups
│ ❌ \`\`.antidelete off dm\`\` - Disable in DMs
│ 🔄 \`\`.antidelete set gc\`\` - Toggle for GCs
│ 🔄 \`\`.antidelete set dm\`\` - Toggle for DMs
│ ✅ \`\`.antidelete set all\`\` - Enable everywhere
│ 📊 \`\`.antidelete status\`\` - Show status
│
╰━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: quotedContact, ...newsletterContext });
    }
  } catch (e) {
    console.error("⚠️ Error in antidelete command:", e);
    return await conn.sendMessage(from, { 
      text: "❌ An error occurred while processing your request." 
    }, { quoted: quotedContact, ...newsletterContext });
  }
});
