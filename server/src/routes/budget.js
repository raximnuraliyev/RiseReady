import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { getBudgetItems, createBudgetItem, updateBudgetItem, deleteBudgetItem, getBudgetSummary } from '../controllers/budgetController.js'

const router = Router()

router.get('/', auth, getBudgetItems)
router.get('/summary', auth, getBudgetSummary)
router.post('/', auth, createBudgetItem)
router.put('/:id', auth, updateBudgetItem)
router.delete('/:id', auth, deleteBudgetItem)

export default router
