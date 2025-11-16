import { InternshipApplication } from '../models/InternshipApplication.js'

export async function listInternships(req, res) {
  // Placeholder for future aggregator; return empty array for now
  res.json([])
}

export async function applyInternship(req, res) {
  const { internshipId, resumeUrl } = req.body
  const exists = await InternshipApplication.findOne({ userId: req.user.id, internshipId })
  if (exists) return res.status(409).json({ error: 'Already applied' })
  const app = await InternshipApplication.create({ userId: req.user.id, internshipId, resumeUrl })
  res.status(201).json({ id: String(app._id) })
}

export async function listMyApplications(req, res) {
  const apps = await InternshipApplication.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(apps.map(a => ({
    id: String(a._id), internshipId: a.internshipId, status: a.status, appliedAt: a.appliedAt, updatedAt: a.updatedAt, resumeUrl: a.resumeUrl
  })))
}
