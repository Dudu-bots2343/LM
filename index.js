// BOT FINAL A7 – Discord.js v14
// ⚠️ USE COM EXTREMO CUIDADO ⚠️
// Este comando APAGA canais, APAGA cargos, EXPULSA TODOS e o bot SAI do servidor.

import { Client, GatewayIntentBits, PermissionsBitField } from "discord.js";
import express from "express";

// ====================== CONFIG ======================
const TOKEN = process.env.TOKEN; // coloque no GitHub/Render
const PREFIX = "!";
const SENHA_CONFIRMACAO = "lm1234pcd";

// ====================== CLIENT ======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// ====================== KEEP ALIVE ==================
const app = express();
app.get("/", (req, res) => res.send("Bot Final A7 online 🚨"));
app.listen(3000, () => console.log("KeepAlive ativo"));

// ====================== READY =======================
client.once("ready", () => {
  console.log(`Logado como ${client.user.tag}`);
});

// ====================== COMMAND =====================
client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  if (message.content === `${PREFIX}finala7`) {
    // Apenas DONO do servidor pode usar
    if (message.author.id !== message.guild.ownerId) {
      return message.reply("❌ Apenas o **dono do servidor** pode usar este comando.");
    }

    // Checar permissões do bot
    const perms = message.guild.members.me.permissions;
    const needed = [
      PermissionsBitField.Flags.Administrator,
    ];

    if (!perms.has(needed)) {
      return message.reply("❌ Eu preciso de **ADMINISTRADOR** para executar isso.");
    }

    // Pedido de senha
    await message.reply("🔐 **Confirmação necessária**\nDigite a senha para continuar:");

    const filter = (m) => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 30000, max: 1 });

    collector.on("collect", async (msg) => {
      if (msg.content !== SENHA_CONFIRMACAO) {
        await message.channel.send("❌ Senha incorreta. Operação cancelada.");
        return;
      }

      // ====================== AVISO ======================
      await message.channel.send(`📢 ⚠️ **AVISO OFICIAL – LEIAM COM ATENÇÃO** ⚠️

Hoje chega ao fim um ciclo que marcou histórias, amizades e momentos inesquecíveis.
Após muito tempo de existência, decisões difíceis e reflexões necessárias, informamos que a **FAMÍLIA A7 FOI OFICIALMENTE ENCERRADA**.

Nada disso apaga tudo o que foi vivido aqui. Cada conversa, cada risada, cada conflito e cada conquista fizeram parte dessa caminhada. A Família A7 não foi apenas um nome, foi um período da vida de muitos.

A partir deste momento, todas as atividades estão finalizadas.
Não haverá continuidade, retomada ou substituição.

Aos que estiveram presentes desde o início, aos que chegaram depois e aos que ajudaram a manter tudo de pé: nosso respeito e agradecimento.

Algumas histórias não acabam por falta de força, mas porque chegaram ao seu fim.

🖤 **Família A7 – encerrada.**`);

      // ====================== APAGAR CANAIS ======================
      for (const channel of message.guild.channels.cache.values()) {
        try {
          await channel.delete();
        } catch (e) {}
      }

      // ====================== APAGAR CARGOS ======================
      for (const role of message.guild.roles.cache.values()) {
        if (role.managed) continue; // ignora cargos de bots
        try {
          await role.delete();
        } catch (e) {}
      }

      // ====================== EXPULSAR MEMBROS ======================
      await message.guild.members.fetch();
      for (const member of message.guild.members.cache.values()) {
        if (member.id === client.user.id) continue;
        try {
          await member.kick("Finalização Família A7");
        } catch (e) {}
      }

      // ====================== BOT SAI ======================
      try {
        await message.guild.leave();
      } catch (e) {}
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        message.channel.send("⏰ Tempo esgotado. Operação cancelada.");
      }
    });
  }
});

// ====================== LOGIN =======================
client.login(TOKEN);
