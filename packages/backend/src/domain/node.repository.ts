import { Node } from "./node.entity";

export interface NodeRepository {
  findAll(): Promise<Node[]>;
  findChildrenByParentId(parentId: string): Promise<Node[]>;
  findById(id: string): Promise<Node | null>;
  search(query: string): Promise<Node[]>;
}
