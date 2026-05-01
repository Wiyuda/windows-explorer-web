<script setup lang="ts">
import type { NodeWithChildren } from '../types';
import TreeNode from './TreeNode.vue';

defineProps<{
  tree: NodeWithChildren[];
  selectedId: string | null;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>

<template>
  <div class="p-2">
    <div v-if="tree.length === 0" class="text-gray-400 text-sm italic p-4 text-center">
      No folders found
    </div>
    <TreeNode 
      v-for="node in tree" 
      :key="node.id" 
      :node="node" 
      :selected-id="selectedId"
      @select="(id) => emit('select', id)"
    />
  </div>
</template>
