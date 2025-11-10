import Joi from 'joi'

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    if (error) {
      return res.status(400).json({ error: 'Validation failed', details: error.details.map(d => d.message) })
    }
    req.body = value
    next()
  }
}

export const schemas = {
  signup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().max(100).optional()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  updateProfile: Joi.object({
    name: Joi.string().max(100).optional().allow(''),
    avatarUrl: Joi.string().uri().optional().allow(''),
    pronouns: Joi.string().max(50).optional().allow(''),
    major: Joi.string().max(100).optional().allow(''),
    year: Joi.string().max(10).optional().allow(''),
    university: Joi.string().max(200).optional().allow(''),
    bio: Joi.string().max(1000).optional().allow(''),
    linkedin: Joi.string().max(200).optional().allow(''),
    github: Joi.string().max(200).optional().allow(''),
    discord: Joi.string().max(100).optional().allow(''),
    telegram: Joi.string().max(100).optional().allow(''),
  }),
  settings: Joi.object({
    notifications: Joi.object({
      reminders: Joi.boolean(), achievements: Joi.boolean(), social: Joi.boolean(), career: Joi.boolean()
    }).optional(),
    privacy: Joi.object({ profileVisible: Joi.boolean(), statsVisible: Joi.boolean() }).optional()
  }),
  calendarEvent: Joi.object({
    title: Joi.string().required(),
    type: Joi.string().optional(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    reminderMinutes: Joi.number().integer().min(0).optional(),
    location: Joi.string().optional(),
  }),
  internshipApply: Joi.object({
    internshipId: Joi.string().required(),
    resumeUrl: Joi.string().uri().optional(),
  })
}
