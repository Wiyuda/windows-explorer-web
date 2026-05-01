import { pgTable, uuid, varchar, timestamp, pgEnum, index } from "drizzle-orm/pg-core";

export const nodeTypeEnum = pgEnum("node_type", ["folder", "file"]);

export const nodes = pgTable("nodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: nodeTypeEnum("type").notNull().default("folder"),
  parentId: uuid("parent_id").references(() => nodes.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    parentIdIdx: index("parent_id_idx").on(table.parentId),
  };
});

export type Node = typeof nodes.$inferSelect;
export type NewNode = typeof nodes.$inferInsert;
