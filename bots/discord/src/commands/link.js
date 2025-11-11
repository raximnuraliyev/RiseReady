const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Discord account to your RiseReady account using a code')
    .addStringOption(opt => opt.setName('code').setDescription('Verification code from the RiseReady website').setRequired(true)),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    const code = interaction.options.getString('code');
    const discordId = interaction.user.id;
    await interaction.deferReply({ ephemeral: true });
    try {
      const discordTag = interaction.user.tag;
      const res = await axios.post(`${BACKEND_URL}/api/bots/discord/link`, { discordId, linkCode: code, discordTag });
      const data = res.data || {};
      if (data.error) {
        return interaction.editReply({ content: `❌ ${data.error}` });
      }
      // Backend should return userId on success
      const userId = data.userId || data.user?.id || null;
      const returnedTag = data.discordTag || data.user?.discord || null;
      if (userId) client.userCache.set(discordId, userId);
      return interaction.editReply({ content: `✅ Linked! Your RiseReady account is now connected.${returnedTag ? ` Discord: ${returnedTag}` : ''}` });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to link';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
