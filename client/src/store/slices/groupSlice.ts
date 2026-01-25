import { StateCreator } from 'zustand';
import { Group } from '../../types/models';

export interface GroupSlice {
  groups: Group[];
  currentGroup: Group | null;
  isLoadingGroups: boolean;
  // Actions
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  setCurrentGroup: (group: Group | null) => void;
  setIsLoadingGroups: (isLoading: boolean) => void;
}

export const createGroupSlice: StateCreator<GroupSlice> = (set) => ({
  groups: [],
  currentGroup: null,
  isLoadingGroups: false,

  setGroups: (groups) => set({ groups }),
  
  addGroup: (group) => 
    set((state) => ({ groups: [...state.groups, group] })),

  setCurrentGroup: (group) => set({ currentGroup: group }),
  
  setIsLoadingGroups: (isLoading) => set({ isLoadingGroups: isLoading }),
});