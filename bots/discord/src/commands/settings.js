const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription("View or update your bot settings")
    .addSubcommand(sc => sc.setName('view').setDescription('View your settings'))
    .addSubcommand(sc => sc.setName('notifications').setDescription('Update notifications').addStringOption(opt => opt.setName('value').setDescription('on or off').addChoices({ name: 'on', value: 'on' }, { name: 'off', value: 'off' }).setRequired(true))),

  async execute(interaction, client, { axios, BACKEND_URL }) {
    const discordId = interaction.user.id;
    const discordTag = interaction.user.tag;
    const sub = interaction.options.getSubcommand();
    await interaction.deferReply();
    try {
      if (sub === 'view') {
        const res = await axios.get(`${BACKEND_URL}/api/bots/discord/settings`, { params: { discordId, discordTag } });
        const settings = res.data || {};
        return interaction.editReply({ content: `Your settings:\nNotifications: ${settings.notifications?.reminders ? 'on' : 'off'}` });
      } else if (sub === 'notifications') {
        const value = interaction.options.getString('value');
        const payload = { discordId, settings: { notifications: { reminders: value === 'on' } } };
        payload.discordTag = discordTag
        await axios.put(`${BACKEND_URL}/api/bots/discord/settings`, payload);
        return interaction.editReply({ content: `Notifications set to ${value}` });
      }
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Failed to update settings';
      return interaction.editReply({ content: `❌ ${message}` });
    }
  }
};
