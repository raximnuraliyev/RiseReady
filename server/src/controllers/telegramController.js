// Lightweight wrappers that adapt telegram request params to existing discord handlers
import * as bots from './botsController.js'

function mapTelegramToDiscord(req) {
  // Map telegramId -> discordId and telegramUsername -> discordTag for reuse
  if (req.body && req.body.telegramId) req.body.discordId = req.body.telegramId
  if (req.body && req.body.telegramUsername) req.body.discordTag = req.body.telegramUsername
  if (req.query && req.query.telegramId) req.query.discordId = req.query.telegramId
  if (req.query && req.query.telegramUsername) req.query.discordTag = req.query.telegramUsername
}

export async function linkTelegramAccount(req, res) {
  mapTelegramToDiscord(req)
  return bots.linkDiscordAccount(req, res)
}

export async function botCreateFocus(req, res) {
  mapTelegramToDiscord(req)
  return bots.botCreateFocus(req, res)
}

export async function botCheckIn(req, res) {
  mapTelegramToDiscord(req)
  return bots.botCheckIn(req, res)
}

export async function botGetStats(req, res) {
  mapTelegramToDiscord(req)
  return bots.botGetStats(req, res)
}

export async function botGetBadges(req, res) {
  mapTelegramToDiscord(req)
  return bots.botGetBadges(req, res)
}

export async function botGetInternships(req, res) {
  mapTelegramToDiscord(req)
  return bots.botGetInternships(req, res)
}

export async function botGetLeaderboard(req, res) {
  mapTelegramToDiscord(req)
  return bots.botGetLeaderboard(req, res)
}

export async function botGetSettings(req, res) {
  mapTelegramToDiscord(req)
  return bots.botGetSettings(req, res)
}

export async function botUpdateSettings(req, res) {
  mapTelegramToDiscord(req)
  return bots.botUpdateSettings(req, res)
}
