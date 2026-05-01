import { db } from "./connection";
import { nodes } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data (Idempotency)
  await db.delete(nodes);

  // Level 1: Root Folders
  const [root1, root2] = await db.insert(nodes).values([
    { name: "Documents", type: "folder", parentId: null },
    { name: "Pictures", type: "folder", parentId: null },
  ]).returning();

  if (!root1 || !root2) throw new Error("Failed to insert roots");

  // Level 2: Subfolders in Documents
  const [subDoc1] = await db.insert(nodes).values([
    { name: "Work", type: "folder", parentId: root1.id },
    { name: "Personal", type: "folder", parentId: root1.id },
  ]).returning();

  if (!subDoc1) throw new Error("Failed to insert subDoc1");

  // Level 3: Subfolders in Work (Deep nesting test)
  const [deepFolder] = await db.insert(nodes).values([
    { name: "Projects 2025", type: "folder", parentId: subDoc1.id },
  ]).returning();

  if (!deepFolder) throw new Error("Failed to insert deepFolder");

  // Level 4: Subfolders in Projects 2025
  const [veryDeepFolder] = await db.insert(nodes).values([
    { name: "Q1 Reports", type: "folder", parentId: deepFolder.id },
  ]).returning();

  if (!veryDeepFolder) throw new Error("Failed to insert veryDeepFolder");

  // Files at various levels
  await db.insert(nodes).values([
    { name: "resume.pdf", type: "file", parentId: subDoc1.id },
    { name: "budget.xlsx", type: "file", parentId: veryDeepFolder.id },
  ]);

  // Level 2: Pictures
  const [subPic1] = await db.insert(nodes).values([
    { name: "Vacation 2025", type: "folder", parentId: root2.id },
  ]).returning();

  if (!subPic1) throw new Error("Failed to insert subPic1");

  // Files in Vacation
  await db.insert(nodes).values([
    { name: "beach.jpg", type: "file", parentId: subPic1.id },
    { name: "sunset.png", type: "file", parentId: subPic1.id },
  ]);

  console.log("Seeding completed successfully with deep hierarchy!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
