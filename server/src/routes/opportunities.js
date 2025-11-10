import { Router } from 'express'
import { listAggregatedOpportunities } from '../controllers/opportunitiesController.js'

const router = Router()

router.get('/', listAggregatedOpportunities)

export default router
