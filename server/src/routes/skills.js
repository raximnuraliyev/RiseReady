import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { getSkills, createSkill, updateSkill, deleteSkill, practiceSkill } from '../controllers/skillsController.js'
import { Skill } from '../models/Skill.js'

const router = Router()

router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const skills = await Skill.find({ userId });
    
    const total = skills.length;
    const inProgress = skills.filter(skill => skill.level < 5).length;
    
    res.json({
      total,
      inProgress
    });
  } catch (error) {
    console.error('Error getting skills summary:', error);
    res.status(500).json({ message: 'Failed to get skills summary' });
  }
});

router.get('/', auth, getSkills)
router.post('/', auth, createSkill)
router.put('/:id', auth, updateSkill)
router.delete('/:id', auth, deleteSkill)
router.post('/:id/practice', auth, practiceSkill)

export default router
