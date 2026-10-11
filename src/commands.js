// Your bot's behaviour. Add commands here; grammY's docs (grammy.dev) cover
// keyboards, sessions, files, inline queries and everything else.


import { InlineKeyboard } from "grammy"

export function registerCommands(bot) {
  bot.command("start", (ctx) =>
    ctx.reply("Welcome to Anime Finder! 🍥\nSend an anime name, like Naruto or One Piece."),
  )

  bot.command("help", (ctx) =>
    ctx.reply("Send an anime name to find its rating, episodes, year, and description."),
  )

  bot.command("ping", (ctx) => ctx.reply("pong"))

  bot.command("id", (ctx) =>
    ctx.reply(`Chat id: ${ctx.chat.id}\nYour id: ${ctx.from?.id ?? "unknown"}`),
  )

  bot.callbackQuery("ping", (ctx) =>
    ctx.answerCallbackQuery({ text: "pong" }),
  )

  bot.on("message:text", async (ctx) => {
    const query = ctx.message.text.trim()

    if (query.startsWith("/")) return

    await ctx.reply("🔎 Searching for anime...")

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`,
      )

      if (!response.ok) {
        await ctx.reply("Search is temporarily unavailable. Please try again.")
        return
      }

      const result = await response.json()
      const anime = result.data?.[0]

      if (!anime) {
        await ctx.reply("No anime found. Try another name.")
        return
      }

      const title = anime.title_english || anime.title
      const rating = anime.score ?? "Not available"
      const episodes = anime.episodes ?? "Unknown"
      const year = anime.year ?? anime.aired?.prop?.from?.year ?? "Unknown"
      const description = anime.synopsis
        ? anime.synopsis.slice(0, 700)
        : "No description available."

      await ctx.reply(
        `🍥 ${title}\n\n⭐ Rating: ${rating}/10\n🎬 Episodes: ${episodes}\n📅 Year: ${year}\n\n📝 ${description}\n\n🔗 ${anime.url}`,
      )
    } catch {
      await ctx.reply("Could not connect to the anime database. Try again later.")
    }
  })
}
