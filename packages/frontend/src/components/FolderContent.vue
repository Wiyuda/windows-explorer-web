<script setup lang="ts">
import type { Node } from '../types';

defineProps<{
  children: Node[];
  title: string;
}>();

const emit = defineEmits<{
  (e: 'navigate', id: string): void;
}>();

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
</script>

<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Breadcrumb Header -->
    <div class="px-8 py-4 flex items-center space-x-2 text-gray-400 text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>›</span>
      <span class="text-gray-600 font-medium">{{ title }}</span>
    </div>

    <!-- Table Header -->
    <div class="px-8 py-2 border-b border-gray-50 grid grid-cols-12 gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      <div class="col-span-6">Name</div>
      <div class="col-span-3">Date Modified</div>
      <div class="col-span-2">Size</div>
      <div class="col-span-1 text-right">Action</div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div v-if="children.length === 0" class="flex flex-col items-center justify-center h-full text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <p class="text-sm font-medium">This folder is empty</p>
      </div>

      <div v-else class="divide-y divide-gray-50">
        <div 
          v-for="item in children" 
          :key="item.id"
          class="px-8 py-3 grid grid-cols-12 gap-4 items-center hover:bg-blue-50/40 transition-colors group cursor-pointer"
          @dblclick="item.type === 'folder' ? emit('navigate', item.id) : null"
        >
          <!-- Name Column -->
          <div class="col-span-6 flex items-center space-x-4">
            <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white shadow-sm transition-colors">
              <template v-if="item.type === 'folder'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </template>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </template>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-semibold text-gray-700 truncate group-hover:text-blue-600 transition-colors">{{ item.name }}</span>
              <span class="text-[10px] text-gray-400 font-medium capitalize">{{ item.type }}</span>
            </div>
          </div>

          <!-- Date Column -->
          <div class="col-span-3 text-xs text-gray-500">
            {{ formatDate(item.createdAt) }}
          </div>

          <!-- Size Column -->
          <div class="col-span-2 text-xs text-gray-400 font-medium">
            {{ item.type === 'file' ? '2.4 MB' : '—' }}
          </div>

          <!-- Action Column -->
          <div class="col-span-1 text-right">
            <button class="text-gray-300 hover:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
