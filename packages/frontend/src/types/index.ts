export interface Node {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
  createdAt: string;
}

export interface NodeWithChildren extends Node {
  children: NodeWithChildren[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
