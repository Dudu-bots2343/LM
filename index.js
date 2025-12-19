import { Client, GatewayIntentBits, PermissionsBitField } from "discord.js";
import express from "express";

// ================= CONFIG =================
const TOKEN = process.env.TOKEN || process.env.DISCORD_TOKEN;
const PREFIX = "!";
const SENHA = "lm1234pcd";

// =============== TOKEN CHECK ===============
if (!TOKEN) {
  console.error("❌ TOKEN não definido no Render (Environment Variables)");
  process.exit(1);
}

// ================= CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// ================= KEEP ALIVE ==============
const app = express();
app.get("/", (req, res) => res.send("Bot Final A7 online 🚨"));
app.listen(3000, () => console.log("KeepAlive ativo"));

// ================= READY ===================
client.once("ready", () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
});

// ================= COMMAND =================
client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  if (message.content === `${PREFIX}finala7`) {
    if (message.author.id !== message.guild.ownerId) {
      return message.reply("❌ Apenas o dono do servidor pode usar.");
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply("❌ Preciso de ADMINISTRADOR.");
    }

    await message.reply("🔐 Digite a senha para confirmar:");

    const filter = (m) => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({
      filter,
      time: 30000,
      max: 1,
    });

    collector.on("collect", async (msg) => {
      if (msg.content !== SENHA) {
        return message.channel.send("❌ Senha incorreta. Cancelado.");
      }

      await message.channel.send(`📢 ⚠️ **AVISO OFICIAL – LEIAM COM ATENÇÃO** ⚠️

Hoje chega ao fim um ciclo que marcou histórias, amizades e momentos inesquecíveis.
Após muito tempo de existência, decisões difíceis e reflexões necessárias, informamos que a **FAMÍLIA A7 FOI OFICIALMENTE ENCERRADA**.

Nada disso apaga tudo o que foi vivido aqui. Cada conversa, cada risada, cada conflito e cada conquista fizeram parte dessa caminhada.

A partir deste momento, todas as atividades estão finalizadas.
Não haverá continuidade, retomada ou substituição.

🖤 **Família A7 – encerrada.**`);

      // Apagar canais
      for (const c of message.guild.channels.cache.values()) {
        try { await c.delete(); } catch {}
      }

      // Apagar cargos
      for (const r of message.guild.roles.cache.values()) {
        if (r.managed) continue;
        try { await r.delete(); } catch {}
      }

      // Expulsar membros
      await message.guild.members.fetch();
      for (const m of message.guild.members.cache.values()) {
        if (m.id === client.user.id) continue;
        try { await m.kick("Encerramento Família A7"); } catch {}
      }

      // Bot sai
      await message.guild.leave();
    });

    collector.on("end", (c) => {
      if (c.size === 0) {
        message.channel.send("⏰ Tempo esgotado. Cancelado.");
      }
    });
  }
});

// ================= LOGIN ===================
client.login(TOKEN);
