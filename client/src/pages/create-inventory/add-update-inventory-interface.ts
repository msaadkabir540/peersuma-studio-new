interface InventoryFieldsInterface {
  name: string;
  clientId: string;
  description: string;
  category: string;
  complexity: string;
  instructions: string;
  example: string;
  userId: string;
}

interface InventoryFieldsInterface {
  _id: string;
  name: string;
  clientId: string;
  description: string;
  level: string;
  category: string;
  complexity: string;
  instructions: string;
  example: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export { InventoryFieldsInterface };
