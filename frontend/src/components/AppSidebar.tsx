'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight, File, Folder, FileText, User } from 'lucide-react';
import { fetchUserTeams, fetchTeamProjects, fetchProjectFiles } from '@/lib/api';
import { FigmaProject, FigmaFile, FigmaTeam, FigmaUser, UserTeamsResponse, TeamProjectsResponse, ProjectFilesResponse } from '@/lib/types';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AppSidebarProps {
  authenticated: boolean;
  onPickFile: (file: { fileKey: string; name?: string }) => void;
}

export function AppSidebar({ authenticated, onPickFile }: AppSidebarProps) {
  const [user, setUser] = useState<FigmaUser | null>(null);
  const [teams, setTeams] = useState<FigmaTeam[]>([]);
  const [teamProjects, setTeamProjects] = useState<{ [teamId: string]: FigmaProject[] }>({});
  const [projectFiles, setProjectFiles] = useState<{ [projectId: string]: FigmaFile[] }>({});
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingTeamProjects, setLoadingTeamProjects] = useState<Set<string>>(new Set());
  const [loadingProjectFiles, setLoadingProjectFiles] = useState<Set<string>>(new Set());

  // Load user teams when authenticated
  useEffect(() => {
    if (!authenticated) return;

    const loadUserTeams = async () => {
      setLoadingTeams(true);
      try {
        console.log('🔄 [SIDEBAR] Loading user teams...');
        const response: UserTeamsResponse = await fetchUserTeams();
        console.log('✅ [SIDEBAR] User data loaded:', response.user);
        console.log('✅ [SIDEBAR] Teams loaded:', response.teams);
        setUser(response.user);
        setTeams(response.teams || []);
      } catch (error) {
        console.error('❌ [SIDEBAR] Failed to fetch user teams:', error);
        setUser(null);
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };

    loadUserTeams();
  }, [authenticated]);

  const loadTeamProjects = async (teamId: string) => {
    if (teamProjects[teamId] || loadingTeamProjects.has(teamId)) return; // Already loaded or loading
    
    setLoadingTeamProjects(prev => new Set([...prev, teamId]));
    
    try {
      console.log('🔄 [SIDEBAR] Loading projects for team:', teamId);
      const response: TeamProjectsResponse = await fetchTeamProjects(teamId);
      console.log('✅ [SIDEBAR] Projects loaded:', response.projects);
      setTeamProjects(prev => ({ ...prev, [teamId]: response.projects || [] }));
    } catch (error) {
      console.error('❌ [SIDEBAR] Failed to fetch team projects:', error);
      setTeamProjects(prev => ({ ...prev, [teamId]: [] }));
    } finally {
      setLoadingTeamProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });
    }
  };

  const loadProjectFiles = async (projectId: string) => {
    if (projectFiles[projectId] || loadingProjectFiles.has(projectId)) return; // Already loaded or loading
    
    console.log('🔄 [SIDEBAR] Starting to load files for project:', projectId);
    setLoadingProjectFiles(prev => new Set([...prev, projectId]));
    
    try {
      console.log('📡 [SIDEBAR] Making API call to fetchProjectFiles with projectId:', projectId);
      const response: ProjectFilesResponse = await fetchProjectFiles(projectId);
      console.log('📦 [SIDEBAR] Raw API response for files:', response);
      console.log('📁 [SIDEBAR] Files array:', response.files);
      console.log('📊 [SIDEBAR] Number of files received:', response.files?.length || 0);
      
      if (response.files && response.files.length > 0) {
        console.log('✅ [SIDEBAR] Files loaded successfully:', response.files.map(f => ({ key: f.key, name: f.name })));
      } else {
        console.log('⚠️ [SIDEBAR] No files found in response or empty files array');
      }
      
      setProjectFiles(prev => ({ ...prev, [projectId]: response.files || [] }));
    } catch (error) {
      console.error('❌ [SIDEBAR] Failed to fetch project files for project', projectId, ':', error);
      console.error('🔍 [SIDEBAR] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        projectId: projectId
      });
      setProjectFiles(prev => ({ ...prev, [projectId]: [] }));
    } finally {
      setLoadingProjectFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        console.log('✅ [SIDEBAR] Finished loading files for project:', projectId);
        return newSet;
      });
    }
  };



  const handleFileClick = (fileKey: string, name?: string) => {
    onPickFile({ fileKey, name });
  };

  if (!authenticated) {
    return (
      <Sidebar>
        <SidebarContent>
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm font-light">Connectez-vous pour accéder à vos fichiers Figma</p>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-4">
          <h2 className="text-lg font-semibold">Vos fichiers</h2>
          <p className="text-sm text-muted-foreground">Équipes et projets</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Mes Teams
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loadingTeams ? (
                // Loading teams
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuItem key={`loading-team-${index}`}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))
              ) : teams.length > 0 ? (
                // Teams loaded - hierarchical navigation
                teams.map((team) => (
                  <Collapsible key={team.id} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          onClick={() => loadTeamProjects(team.id)}
                          className="w-full justify-start"
                        >
                          <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          <Folder className="w-4 h-4" />
                          <div className="flex flex-col items-start overflow-hidden flex-1">
                            <span className="text-sm font-medium truncate w-full">{team.name}</span>
                            <span className="text-xs text-muted-foreground truncate w-full">Team</span>
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {loadingTeamProjects.has(team.id) ? (
                            // Loading projects for this team
                            Array.from({ length: 2 }).map((_, index) => (
                              <SidebarMenuSubItem key={`loading-project-${index}`}>
                                <SidebarMenuSkeleton showIcon />
                              </SidebarMenuSubItem>
                            ))
                          ) : teamProjects[team.id]?.length > 0 ? (
                            // Projects loaded for this team
                            teamProjects[team.id].map((project) => (
                              <Collapsible key={project.id} className="group/project">
                                <SidebarMenuSubItem>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton 
                                      onClick={() => loadProjectFiles(project.id)}
                                    >
                                      <ChevronRight className="w-3 h-3 transition-transform group-data-[state=open]/project:rotate-90" />
                                      <Folder className="w-3 h-3" />
                                      <span className="text-sm truncate">{project.name}</span>
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <SidebarMenuSub>
                                      {loadingProjectFiles.has(project.id) ? (
                                        // Loading files for this project
                                        Array.from({ length: 3 }).map((_, index) => (
                                          <SidebarMenuSubItem key={`loading-file-${index}`}>
                                            <SidebarMenuSkeleton />
                                          </SidebarMenuSubItem>
                                        ))
                                      ) : projectFiles[project.id]?.length > 0 ? (
                                        // Files loaded for this project
                                        projectFiles[project.id].map((file) => (
                                          <SidebarMenuSubItem key={file.key}>
                                            <SidebarMenuSubButton 
                                              onClick={() => handleFileClick(file.key, file.name)}
                                            >
                                              <File className="w-3 h-3" />
                                              <span className="text-sm truncate">{file.name}</span>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        ))
                                      ) : projectFiles[project.id] ? (
                                        // No files found in this project
                                        <SidebarMenuSubItem>
                                          <div className="px-2 py-1 text-xs text-muted-foreground">
                                            Aucun fichier trouvé
                                          </div>
                                        </SidebarMenuSubItem>
                                      ) : null}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </SidebarMenuSubItem>
                              </Collapsible>
                            ))
                          ) : teamProjects[team.id] ? (
                            // No projects found in this team
                            <SidebarMenuSubItem>
                              <div className="px-2 py-2 text-xs text-muted-foreground">
                                Aucun projet trouvé
                              </div>
                            </SidebarMenuSubItem>
                          ) : null}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))
              ) : (
                <SidebarMenuItem>
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    Aucune équipe trouvée
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* User Profile Footer */}
      <SidebarFooter>
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start">
                <div className="flex items-center space-x-3 w-full">
                  {user.img_url ? (
                    <Image 
                      src={user.img_url} 
                      alt={user.handle || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center">
                      <User className="w-4 h-4 text-[#A3A3A3]" />
                    </div>
                  )}
                  <div className="flex flex-col items-start overflow-hidden flex-1">
                    <span className="text-sm font-medium truncate w-full text-[#EAEAEA]">
                      {user.handle || 'Utilisateur'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {user.email}
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="px-2 py-4 text-center">
            <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center mx-auto mb-2">
              <User className="w-4 h-4 text-[#A3A3A3]" />
            </div>
            <p className="text-xs text-muted-foreground">Chargement...</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}