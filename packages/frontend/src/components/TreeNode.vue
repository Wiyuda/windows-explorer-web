<script setup lang="ts">
import { ref } from 'vue';
import type { NodeWithChildren } from '../types';

const props = defineProps<{
  node: NodeWithChildren;
  selectedId: string | null;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const isOpen = ref(false);

const toggle = () => {
  if (props.node.type === 'folder') {
    isOpen.value = !isOpen.value;
  }
};

const select = () => {
  if (props.node.type === 'folder') {
    emit('select', props.node.id);
  }
};
</script>

<template>
  <div class="select-none">
    <div 
      class="flex items-center py-2 px-3 mx-2 cursor-pointer rounded-lg transition-all duration-200 group"
      :class="selectedId === node.id 
        ? 'bg-blue-50 text-blue-600 font-semibold' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      @click="select"
    >
      <!-- Expand/Collapse Icon -->
      <span 
        v-if="node.type === 'folder'"
        class="w-4 h-4 flex items-center justify-center mr-2 text-gray-400 group-hover:text-gray-600 transition-colors"
        @click.stop="toggle"
      >
        <svg 
          v-if="node.children.length > 0"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" 
          class="w-3 h-3 transition-transform duration-200"
          :class="{ 'rotate-90': isOpen }"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </span>
      <span v-else class="w-4 mr-2"></span>

      <!-- Folder/File Icon (Modern Outline) -->
      <span class="mr-3 transition-colors">
        <template v-if="node.type === 'folder'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="selectedId === node.id ? 'text-blue-500' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </template>
      </span>

      <span class="truncate text-sm tracking-tight">{{ node.name }}</span>
    </div>

    <!-- Recursive Children -->
    <div v-if="isOpen && node.children.length > 0" class="ml-6 border-l border-gray-100">
      <TreeNode 
        v-for="child in node.children" 
        :key="child.id" 
        :node="child"
        :selected-id="selectedId"
        @select="(id) => emit('select', id)"
      />
    </div>
  </div>
</template>
