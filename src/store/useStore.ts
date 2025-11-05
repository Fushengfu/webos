import { create } from 'zustand';
import { WindowState, ContextMenuState, AppDefinition } from '../types';

interface StoreState {
  windows: WindowState[];
  apps: AppDefinition[];
  startMenuOpen: boolean;
  contextMenu: ContextMenuState;
  highestZIndex: number;
  wallpaper: string;
  
  openWindow: (app: AppDefinition) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  toggleStartMenu: () => void;
  showContextMenu: (x: number, y: number, items: any[]) => void;
  hideContextMenu: () => void;
  setWallpaper: (url: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  windows: [],
  apps: [
    { id: 'file-manager', name: 'File Manager', icon: '📁', component: 'FileManager', defaultWidth: 800, defaultHeight: 600 },
    { id: 'settings', name: 'Settings', icon: '⚙️', component: 'Settings', defaultWidth: 700, defaultHeight: 500 },
    { id: 'text-editor', name: 'Text Editor', icon: '📝', component: 'TextEditor', defaultWidth: 800, defaultHeight: 600 },
    { id: 'browser', name: 'Browser', icon: '🌐', component: 'Browser', defaultWidth: 1000, defaultHeight: 700 },
  ],
  startMenuOpen: false,
  contextMenu: { visible: false, x: 0, y: 0, items: [] },
  highestZIndex: 100,
  wallpaper: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

  openWindow: (app) =>
    set((state) => {
      const newZIndex = state.highestZIndex + 1;
      const newWindow: WindowState = {
        id: `${app.id}-${Date.now()}`,
        title: app.name,
        icon: app.icon,
        component: app.component,
        x: 100 + state.windows.length * 30,
        y: 50 + state.windows.length * 30,
        width: app.defaultWidth,
        height: app.defaultHeight,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        zIndex: newZIndex,
      };
      return {
        windows: [...state.windows.map((w) => ({ ...w, isFocused: false })), newWindow],
        highestZIndex: newZIndex,
        startMenuOpen: false,
      };
    }),

  closeWindow: (id) => set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),
  minimizeWindow: (id) => set((state) => ({ windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w) })),
  maximizeWindow: (id) => set((state) => ({ windows: state.windows.map((w) => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w) })),
  focusWindow: (id) => set((state) => {
    const newZIndex = state.highestZIndex + 1;
    return {
      windows: state.windows.map((w) => w.id === id ? { ...w, isFocused: true, zIndex: newZIndex, isMinimized: false } : { ...w, isFocused: false }),
      highestZIndex: newZIndex,
    };
  }),
  updateWindowPosition: (id, x, y) => set((state) => ({ windows: state.windows.map((w) => w.id === id ? { ...w, x, y } : w) })),
  updateWindowSize: (id, width, height) => set((state) => ({ windows: state.windows.map((w) => w.id === id ? { ...w, width, height } : w) })),
  toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
  showContextMenu: (x, y, items) => set({ contextMenu: { visible: true, x, y, items } }),
  hideContextMenu: () => set((state) => ({ contextMenu: { ...state.contextMenu, visible: false } })),
  setWallpaper: (url) => set({ wallpaper: url }),
}));