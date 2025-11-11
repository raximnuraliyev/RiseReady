// Lightweight wrappers that adapt telegram request params to existing discord handlers
import * as bots from './botsController.js'

function mapTelegramParams(req) {
  // No-op passthrough for telegram params. Keep telegramId/telegramUsername in place
  // for the botsController which now understands telegramId/telegramUsername.
  if (req.body && req.body.telegramId) req.body.telegramId = String(req.body.telegramId)
  if (req.body && req.body.telegramUsername) req.body.telegramUsername = req.body.telegramUsername
  if (req.query && req.query.telegramId) req.query.telegramId = String(req.query.telegramId)
  if (req.query && req.query.telegramUsername) req.query.telegramUsername = req.query.telegramUsername
}

export async function linkTelegramAccount(req, res) {
  mapTelegramParams(req)
  return bots.linkDiscordAccount(req, res)
}

export async function botCreateFocus(req, res) {
  mapTelegramParams(req)
  return bots.botCreateFocus(req, res)
}

export async function botCheckIn(req, res) {
  mapTelegramParams(req)
  return bots.botCheckIn(req, res)
}

export async function botGetStats(req, res) {
  mapTelegramParams(req)
  return bots.botGetStats(req, res)
}

export async function botGetBadges(req, res) {
  mapTelegramParams(req)
  return bots.botGetBadges(req, res)
}

export async function botGetInternships(req, res) {
  mapTelegramParams(req)
  return bots.botGetInternships(req, res)
}

export async function botGetLeaderboard(req, res) {
  mapTelegramParams(req)
  return bots.botGetLeaderboard(req, res)
}

export async function botGetSettings(req, res) {
  mapTelegramParams(req)
  return bots.botGetSettings(req, res)
}

export async function botUpdateSettings(req, res) {
  mapTelegramParams(req)
  return bots.botUpdateSettings(req, res)
}
