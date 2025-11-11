const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Show top users in server'),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    await interaction.deferReply();
    try {
  const discordTag = interaction.user.tag;
  const discordId = interaction.user.id;
  const res = await axios.get(`${BACKEND_URL}/api/bots/discord/leaderboard`, { params: { limit: 10, discordId, discordTag } });
  const board = res.data || [];
      if (!board.length) return interaction.editReply({ content: 'No leaderboard data available.' });
      const lines = board.map((b, i) => `#${i + 1} ${b.username || b.name || b.userId}: ${b.points || b.value}`);
      return interaction.editReply({ content: `Leaderboard:\n${lines.join('\n')}` });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to fetch leaderboard';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
