import { sendInteractive } from '../../lib/sendInteractive.js';
  import axios from 'axios';
export default async (context) => {
  const { client, m, text } = context;
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
    sendInteractive(client, m, 
      "📌 *USAGE*\n━━━━━━━━━━━━━━━━\n🚫 Please provide a search term!\nExample: .google What is treason\n━━━━━━━━━━━━━━━━\n© bmb tech"
    );
    return;
  }

  try {
    let { data } = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${text}&key=AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI&cx=baf9bdb0c631236e5`
    );

    if (data.items.length == 0) {
      sendInteractive(client, m, 
        "❌ *ERROR*\n━━━━━━━━━━━━━━━━\n❌ Unable to find any results\n━━━━━━━━━━━━━━━━\n© bmb tech"
      );
      return;
    }

    let tex = "🔍 *GOOGLE SEARCH*\n";
    tex += "━━━━━━━━━━━━━━━━\n";
    tex += "Search Term: " + text + "\n";
    tex += "\n";

    for (let i = 0; i < data.items.length; i++) {
      tex += "Result " + (i + 1) + "\n";
      tex += "🪧 Title: " + data.items[i].title + "\n";
      tex += "📝 Description: " + data.items[i].snippet + "\n";
      tex += "🌐 Link: " + data.items[i].link + "\n";
      tex += "\n";
    }
    tex += "━━━━━━━━━━━━━━━━\n© bmb tech";

    sendInteractive(client, m, tex);
  } catch (e) {
    sendInteractive(client, m, 
      "❌ *ERROR*\n━━━━━━━━━━━━━━━━\n❌ An error occurred: " + e.message + "\n━━━━━━━━━━━━━━━━\n© bmb tech"
    );
  }
};
