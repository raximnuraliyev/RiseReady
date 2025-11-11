const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('focus')
    .setDescription('Record a focus/study block of given minutes')
    .addIntegerOption(opt => opt.setName('minutes').setDescription('Minutes to log').setRequired(true)),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    const minutes = interaction.options.getInteger('minutes');
    const discordId = interaction.user.id;
    const discordTag = interaction.user.tag;
    await interaction.deferReply();
    try {
  const body = { discordId, minutes, discordTag };
  const res = await axios.post(`${BACKEND_URL}/api/bots/discord/focus`, body);
      const data = res.data || {};
      const totalThisWeek = data.totalThisWeek || data.total || 'N/A';
      const streak = data.streak || 'N/A';
      return interaction.editReply({ content: `Nice — you logged a ${minutes} min session! Your total this week: ${totalThisWeek} mins. Streak: ${streak} days.` });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to log focus';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
