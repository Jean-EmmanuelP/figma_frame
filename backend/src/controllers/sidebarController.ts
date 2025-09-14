import { Request, Response } from 'express';
import axios from 'axios';
import { addTeam, listTeams } from '../dao';

export class SidebarController {
  async getRecentFiles(req: Request, res: Response): Promise<void> {
    console.log('🔍 [BACKEND] getRecentFiles called - route: /me/recent-files');
    console.log('🔍 [BACKEND] Request path:', req.path);
    console.log('🔍 [BACKEND] Request originalUrl:', req.originalUrl);
    console.log('🔍 [BACKEND] User authenticated:', !!req.userId);
    
    res.status(501).json({
      error: "Not implemented: Figma REST API does not provide a public 'recent files' endpoint."
    });
  }

  async addTeam(req: Request, res: Response): Promise<void> {
    try {
      const { teamId, teamName } = req.body;
      
      if (!teamId) {
        res.status(400).json({ error: 'Team ID is required' });
        return;
      }

      await addTeam(req.userId!, teamId, teamName);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Add team error:', error);
      res.status(500).json({ error: 'Failed to add team' });
    }
  }

  async getTeams(req: Request, res: Response): Promise<void> {
    try {
      const teams = await listTeams(req.userId!);
      res.json({ teams });
    } catch (error: any) {
      console.error('Get teams error:', error);
      res.status(500).json({ error: 'Failed to fetch teams' });
    }
  }

  async getTeamProjects(req: Request, res: Response): Promise<void> {
    try {
      const { teamId } = req.params;
      
      const response = await axios.get(`https://api.figma.com/v1/teams/${teamId}/projects`, {
        headers: { Authorization: `Bearer ${req.userToken}` }
      });

      res.json(response.data);
    } catch (error: any) {
      console.error('Team projects error:', error);
      res.status(error.response?.status || 500).json({ 
        error: error.response?.data?.message || 'Failed to fetch team projects' 
      });
    }
  }

  async getProjectFiles(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      
      const response = await axios.get(`https://api.figma.com/v1/projects/${projectId}/files`, {
        headers: { Authorization: `Bearer ${req.userToken}` }
      });

      res.json(response.data);
    } catch (error: any) {
      console.error('Project files error:', error);
      res.status(error.response?.status || 500).json({ 
        error: error.response?.data?.message || 'Failed to fetch project files' 
      });
    }
  }
}

export default new SidebarController();