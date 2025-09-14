import { Router } from 'express';
import { sidebarController } from '../controllers/index';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/recent-files', requireAuth, sidebarController.getRecentFiles.bind(sidebarController));
router.get('/files', requireAuth, sidebarController.getRecentFiles.bind(sidebarController));
router.post('/teams', requireAuth, sidebarController.addTeam.bind(sidebarController));
router.get('/teams', requireAuth, sidebarController.getTeams.bind(sidebarController));
router.get('/teams/:teamId/projects', requireAuth, sidebarController.getTeamProjects.bind(sidebarController));
router.get('/projects/:projectId/files', requireAuth, sidebarController.getProjectFiles.bind(sidebarController));

export default router;