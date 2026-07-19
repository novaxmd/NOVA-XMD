const Ownermiddleware = async (context, next) => {
    const { m, Owner } = context;

    if (!Owner) {
        return m.reply(`🚫 *ACCESS DENIED*\n━━━━━━━━━━━━━━━━\nYou dare use an Owner command?\nYour mere existence insults\nmy code. Crawl back to the\nabyss where mediocrity thrives.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    await next();
};

export default Ownermiddleware;
