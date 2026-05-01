import { eq, ilike } from "drizzle-orm";
import { db } from "../db/connection";
import { nodes } from "../db/schema";
import { Node } from "../../domain/node.entity";
import { NodeRepository } from "../../domain/node.repository";

export class NodeRepositoryImpl implements NodeRepository {
  async findAll(): Promise<Node[]> {
    try {
      const result = await db.select().from(nodes);
      return result as Node[];
    } catch (err: any) {
      throw new Error(`Failed to fetch nodes: ${err.message}`);
    }
  }

  async findChildrenByParentId(parentId: string): Promise<Node[]> {
    try {
      const result = await db.select().from(nodes).where(eq(nodes.parentId, parentId));
      return result as Node[];
    } catch (err: any) {
      throw new Error(`Failed to fetch children: ${err.message}`);
    }
  }

  async findById(id: string): Promise<Node | null> {
    try {
      const [result] = await db.select().from(nodes).where(eq(nodes.id, id));
      return (result as Node) || null;
    } catch (err: any) {
      throw new Error(`Failed to fetch node by id: ${err.message}`);
    }
  }

  async search(query: string): Promise<Node[]> {
    try {
      const result = await db.select().from(nodes).where(
        ilike(nodes.name, `%${query}%`)
      );
      return result as Node[];
    } catch (err: any) {
      throw new Error(`Failed to search nodes: ${err.message}`);
    }
  }
}
