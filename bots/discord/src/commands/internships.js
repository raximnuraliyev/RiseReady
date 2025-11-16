const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('internships')
    .setDescription("Show latest internship posts relevant to your major")
    .addIntegerOption(opt => opt.setName('limit').setDescription('How many results').setRequired(false)),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    const discordId = interaction.user.id;
    const discordTag = interaction.user.tag;
    const limit = interaction.options.getInteger('limit') || 5;
    await interaction.deferReply();
    try {
      // Attempt to fetch user profile to get major; fallback to generic
      let major = null;
      try {
        const u = await axios.get(`${BACKEND_URL}/api/users/me`, { params: { platform: 'discord', discordId } });
        major = u.data?.major || null;
      } catch (e) {
        // ignore
      }
      const params = { limit };
      if (major) params.major = major;
  // Use bot-specific internships endpoint which can use discordId to tailor results
  const res = await axios.get(`${BACKEND_URL}/api/bots/discord/internships`, { params: { discordId, discordTag, limit } });
      const items = res.data || [];
      if (!items.length) return interaction.editReply({ content: 'No internships found.' });
      const lines = items.slice(0, limit).map(i => `• ${i.title} @ ${i.company}${i.applyLink ? ` — ${i.applyLink}` : ''}`);
      return interaction.editReply({ content: `Here are ${Math.min(items.length, limit)} internships you may like:\n${lines.join('\n')}` });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch internships';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
