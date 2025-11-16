const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('stats').setDescription("Show your RiseReady stats"),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    const discordId = interaction.user.id;
    const discordTag = interaction.user.tag;
    await interaction.deferReply();
    try {
  const res = await axios.get(`${BACKEND_URL}/api/bots/discord/stats`, { params: { discordId, discordTag } });
  const stats = res.data || {};
      const embed = new EmbedBuilder()
        .setTitle('Your RiseReady Stats')
        .addFields(
          { name: 'Study Sessions (this week)', value: String(stats.studySessionsThisWeek || 0), inline: true },
          { name: 'Focus streak', value: `${stats.focusStreak || 0} days`, inline: true },
          { name: 'Badges', value: `${(stats.badgesCount || 0)}`, inline: true }
        )
        .setTimestamp();
      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch stats';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
