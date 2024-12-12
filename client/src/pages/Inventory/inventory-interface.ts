interface SortColumnInterface {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface InventoryRowInterface {
  _id: string;
  name: string;
  clientId: string;
  description: string;
  category: string;
  complexity: string;
  instructions: string;
  examples: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export { SortColumnInterface, InventoryRowInterface };
