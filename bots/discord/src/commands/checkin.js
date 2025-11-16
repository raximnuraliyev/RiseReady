const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkin')
    .setDescription('Log a well-being/mood check-in')
    .addStringOption(opt => opt.setName('mood').setDescription('Emoji or mood code').setRequired(true)),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    const mood = interaction.options.getString('mood');
    const discordId = interaction.user.id;
    const discordTag = interaction.user.tag;
    await interaction.deferReply();
    try {
  const res = await axios.post(`${BACKEND_URL}/api/bots/discord/checkin`, { discordId, mood, discordTag });
      const data = res.data || {};
      const avg = data.averageThisWeek || data.avg || 'Good';
      return interaction.editReply({ content: `Thanks for the check-in ${mood}. Your average mood this week: ${avg}. Keep it up!` });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to check in';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
