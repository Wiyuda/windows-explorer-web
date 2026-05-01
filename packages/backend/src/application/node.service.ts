import { Node, NodeWithChildren } from "../domain/node.entity";
import { NodeRepository } from "../domain/node.repository";

export class NodeService {
  constructor(private nodeRepository: NodeRepository) {}

  async getTree(): Promise<NodeWithChildren[]> {
    const allNodes = await this.nodeRepository.findAll();
    return this.buildTree(allNodes);
  }

  async getChildren(parentId: string): Promise<Node[]> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(parentId)) {
      throw new Error("Invalid ID format");
    }
    return this.nodeRepository.findChildrenByParentId(parentId);
  }

  async search(query: string): Promise<Node[]> {
    return this.nodeRepository.search(query);
  }

  /**
   * Algorithm to build a nested tree structure from a flat list of nodes.
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   */
  private buildTree(nodes: Node[]): NodeWithChildren[] {
    const nodeMap: Record<string, NodeWithChildren> = {};
    const tree: NodeWithChildren[] = [];

    // First pass: Create map of all nodes with empty children arrays
    nodes.forEach((node) => {
      nodeMap[node.id] = { ...node, children: [] };
    });

    // Second pass: Link children to parents
    nodes.forEach((node) => {
      const nodeWithChildren = nodeMap[node.id]!;
      if (node.parentId && nodeMap[node.parentId]) {
        // If it has a parent and parent exists in map, add to parent's children
        nodeMap[node.parentId]!.children.push(nodeWithChildren);
      } else {
        // Otherwise, it's a root node
        tree.push(nodeWithChildren);
      }
    });

    return tree;
  }
}
