import { ref } from "vue";
import type { Node, NodeWithChildren } from "../types";
import { fetchTree, fetchChildren, searchNodes } from "../services/api";

export function useFileSystem() {
  const tree = ref<NodeWithChildren[]>([]);
  const selectedFolderChildren = ref<Node[]>([]);
  const selectedFolderId = ref<string | null>(null);
  const searchResults = ref<Node[] | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadTree = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetchTree();
      if (response.success) {
        tree.value = response.data;
      } else {
        error.value = response.message;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      isLoading.value = false;
    }
  };

  const selectFolder = async (folderId: string) => {
    selectedFolderId.value = folderId;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetchChildren(folderId);
      if (response.success) {
        selectedFolderChildren.value = response.data;
        searchResults.value = null; // Clear search when navigating
      } else {
        error.value = response.message;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      isLoading.value = false;
    }
  };

  const performSearch = async (query: string) => {
    if (!query) {
      searchResults.value = null;
      return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      const response = await searchNodes(query);
      if (response.success) {
        searchResults.value = response.data;
      } else {
        error.value = response.message;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    tree,
    selectedFolderChildren,
    selectedFolderId,
    searchResults,
    isLoading,
    error,
    loadTree,
    selectFolder,
    performSearch,
  };
}
