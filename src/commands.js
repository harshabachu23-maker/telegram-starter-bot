// Your bot's behaviour. Add commands here; grammY's docs (grammy.dev) cover
// keyboards, sessions, files, inline queries and everything else.

import { InlineKeyboard } from "grammy"

export function registerCommands(bot) {
  bot.command("start", (ctx) =>
    ctx.reply(
      "Welcome to Anime Finder! 🎌\n\nSend an anime name to search for it.\n\nExample: Naruto"
    )
  )

  bot.command("help", (ctx) =>
    ctx.reply(
      "🎌 Anime Finder Help\n\nSend an anime name to search.\nUse /ping to test the bot."
    )
  )

  bot.command("ping", (ctx) => ctx.reply("pong 🏓"))

  bot.on("message:text", async (ctx) => {
    const query = ctx.message.text.trim()
    if (query.startsWith("/")) return
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=3`)
      if (!response.ok) return ctx.reply("Search is busy. Please try again.")
      const result = await response.json()
      if (!result.data?.length) return ctx.reply("No anime found. Try another name.")
      for (const anime of result.data) {
        await ctx.reply(`🎌 ${anime.title}\n⭐ Score: ${anime.score ?? "N/A"}\n📺 Episodes: ${anime.episodes ?? "Unknown"}\n🔗 ${anime.url}`)
      }
    } catch (error) {
      await ctx.reply("Search failed. Please try again later.")
    }
  })
}
