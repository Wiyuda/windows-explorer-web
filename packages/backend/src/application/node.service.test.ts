import { expect, test, describe, mock } from "bun:test";
import { NodeService } from "./node.service";
import { Node } from "../domain/node.entity";
import { NodeRepository } from "../domain/node.repository";

// Mock Data
const mockNodes: Node[] = [
  { id: "1", name: "Root 1", type: "folder", parentId: null, createdAt: new Date().toISOString() },
  { id: "2", name: "Child 1.1", type: "folder", parentId: "1", createdAt: new Date().toISOString() },
  { id: "3", name: "File 1.1.1", type: "file", parentId: "2", createdAt: new Date().toISOString() },
  { id: "4", name: "Root 2", type: "folder", parentId: null, createdAt: new Date().toISOString() },
];

describe("NodeService", () => {
  const mockRepo: NodeRepository = {
    findAll: mock(() => Promise.resolve(mockNodes)),
    findChildrenByParentId: mock((id: string) => Promise.resolve(mockNodes.filter(n => n.parentId === id))),
    search: mock((q: string) => Promise.resolve(mockNodes.filter(n => n.name.includes(q)))),
    findById: mock((id: string) => Promise.resolve(mockNodes.find(n => n.id === id) || null)),
  };

  const service = new NodeService(mockRepo);

  test("getTree should build a correct nested structure", async () => {
    const tree = await service.getTree();

    expect(tree).toHaveLength(2); // Two root nodes
    
    // Check Root 1
    const root1 = tree.find(n => n.id === "1");
    expect(root1).toBeDefined();
    expect(root1?.children).toHaveLength(1);
    expect(root1?.children[0].id).toBe("2");
    
    // Check nested child (Child 1.1)
    const child11 = root1?.children[0];
    expect(child11?.children).toHaveLength(1);
    expect(child11?.children[0].id).toBe("3");
    expect(child11?.children[0].type).toBe("file");

    // Check Root 2
    const root2 = tree.find(n => n.id === "4");
    expect(root2).toBeDefined();
    expect(root2?.children).toHaveLength(0);
  });

  test("getChildren should validate UUID and return direct children", async () => {
    const validUuid = "550e8400-e29b-41d4-a716-446655440000";
    
    // Reset mock implementation if needed
    (mockRepo.findChildrenByParentId as any).mockImplementation(() => Promise.resolve([]));
    
    await service.getChildren(validUuid);
    expect(mockRepo.findChildrenByParentId).toHaveBeenCalledWith(validUuid);

    // Should throw on invalid UUID
    expect(service.getChildren("invalid-uuid")).rejects.toThrow("Invalid ID format");
  });

  test("search should call repository search", async () => {
    const query = "Root";
    const results = await service.search(query);
    
    expect(results).toHaveLength(2);
    expect(mockRepo.search).toHaveBeenCalledWith(query);
  });
});
