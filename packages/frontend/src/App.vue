<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useFileSystem } from './composables/useFileSystem';
import type { NodeWithChildren } from './types';
import FolderTree from './components/FolderTree.vue';
import FolderContent from './components/FolderContent.vue';

const { 
  tree, 
  selectedFolderChildren, 
  selectedFolderId, 
  searchResults, 
  isLoading, 
  error, 
  loadTree, 
  selectFolder, 
  performSearch 
} = useFileSystem();

const searchQueries = ref('');

onMounted(() => {
  loadTree();
});

// Search with simple debounce logic
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
watch(searchQueries, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(newVal);
  }, 300);
});

const selectedFolderName = computed(() => {
  if (searchResults.value !== null) return `Search results for "${searchQueries.value}"`;
  
  const findName = (nodes: NodeWithChildren[]): string | null => {
    for (const node of nodes) {
      if (node.id === selectedFolderId.value) return node.name;
      if (node.children && node.children.length > 0) {
        const found = findName(node.children);
        if (found) return found;
      }
    }
    return null;
  };
  
  return findName(tree.value) || 'Quick access';
});
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-[#f8f9fa] overflow-hidden text-[#1e293b] font-sans">
    <!-- Top Header / Search Bar -->
    <header class="h-16 border-b flex items-center px-6 justify-between bg-white z-10">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span class="text-lg font-bold text-gray-800 tracking-tight">File Explorer</span>
        </div>
      </div>

      <!-- Search Bar matching UI -->
      <div class="flex-1 max-w-xl mx-12">
        <div class="relative group">
          <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            v-model="searchQueries"
            type="text" 
            placeholder="Search"
            class="block w-full pl-11 pr-4 py-2 border-none rounded-full bg-[#eff2f5] text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-500"
          />
        </div>
      </div>

      <!-- Right Action Icons -->
      <div class="flex items-center space-x-5 text-gray-500">
        <button class="hover:text-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button class="hover:text-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 overflow-hidden cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex overflow-hidden">
      <!-- Left Panel: Folder Tree -->
      <aside class="w-64 bg-white overflow-y-auto flex flex-col">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-800">Explorer</h2>
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Local Storage</p>
        </div>
        
        <div class="px-2 space-y-1">
          <FolderTree 
            :tree="tree" 
            :selected-id="selectedFolderId"
            @select="selectFolder"
          />
        </div>


      </aside>

      <!-- Right Panel: Content -->
      <section class="flex-1 bg-white ml-0.5 overflow-hidden flex flex-col">
        <div v-if="error" class="p-6 m-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p class="font-bold">Backend Connection Error</p>
            <p class="text-sm mt-1 opacity-80">{{ error }}</p>
            <button @click="loadTree" class="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs rounded-lg font-bold hover:bg-red-700 transition-colors">Retry Sync</button>
          </div>
        </div>

        <FolderContent 
          v-else
          :children="searchResults || selectedFolderChildren" 
          :title="selectedFolderName"
          @navigate="selectFolder"
        />
      </section>
    </main>

    <!-- Footer / Status Bar -->
    <footer class="h-10 border-t bg-white flex items-center px-6 justify-between text-xs text-gray-500 font-medium select-none">
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <span>0 items selected | {{ (searchResults || selectedFolderChildren).length }} items</span>
        </div>
        <button class="hover:text-blue-600">Properties</button>
        <button @click="loadTree" class="hover:text-blue-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-1">
          <button class="p-1 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </button>
          <button class="p-1 rounded bg-blue-50 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
        </div>
        <div class="flex items-center">
          <div class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
          <span class="text-gray-400">Online</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

body {
  background-color: #f8f9fa;
}
</style>
