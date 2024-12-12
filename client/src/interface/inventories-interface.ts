interface GetAllInventoriesInterface {
  params?:
    | {
        sortBy: string;
        prefix?: string;
        selectBox?: boolean;
        sortOrder?: string;
      }
    | undefined;
}

interface AddInventoriesInterface {
  _id?: string;
  name: string;
  clientId: string;
  description: string;
  category: string;
  complexity: string;
  instructions: string;
  examples: string;
  userId: string;
}

export { GetAllInventoriesInterface, AddInventoriesInterface };
