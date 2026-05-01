export interface Node {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
  createdAt: Date;
}

export interface NodeWithChildren extends Node {
  children: NodeWithChildren[];
}
