import { Skill } from '../models/Skill.js'

export async function getSkills(req, res) {
  const skills = await Skill.find({ userId: req.user.id }).sort({ category: 1, name: 1 })
  res.json(skills)
}

export async function createSkill(req, res) {
  const { name, category, level } = req.body
  const skill = await Skill.create({ 
    userId: req.user.id, 
    name, 
    category: category || 'Other',
    level: level || 0 
  })
  res.status(201).json(skill)
}

export async function updateSkill(req, res) {
  const { id } = req.params
  const updates = req.body
  const skill = await Skill.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    updates,
    { new: true }
  )
  if (!skill) return res.status(404).json({ error: 'Skill not found' })
  res.json(skill)
}

export async function deleteSkill(req, res) {
  const { id } = req.params
  const skill = await Skill.findOneAndDelete({ _id: id, userId: req.user.id })
  if (!skill) return res.status(404).json({ error: 'Skill not found' })
  res.json({ success: true })
}

export async function practiceSkill(req, res) {
  const { id } = req.params
  const skill = await Skill.findOne({ _id: id, userId: req.user.id })
  if (!skill) return res.status(404).json({ error: 'Skill not found' })
  
  skill.practiced += 1
  skill.lastPracticed = new Date()
  // Increase level slightly with each practice
  skill.level = Math.min(100, skill.level + 2)
  await skill.save()
  
  res.json(skill)
}
