// interface for Clients
interface ClientInterface {
  _id: string;
  id?: string;
  name: string;
  status: boolean;
  website: string;
  createdAt: string;
  updatedAt: string;
  vimeoFolderId: string;
  vimeoFolderName: string;
}

// interface for Get all clients

interface GetAllClientRequestInterface {
  page?: number;
  prefix: string;
  sortBy?: string;
  pageSize?: number;
  sortOrder?: string;
}

interface GetAllClientResponseInterface {
  count: number;
  currentPage: number;
  totalPages: number;
  allClients: ClientInterface;
  status: string;
}

// interface for Get clients by Id

// interface GetAllClientResponseInterface {
//   data: ClientInterface;
// }

// interface for update clients by Id

interface UpdateClientRequestInterface {
  id: string;
  data: ClientInterface;
}
// response
interface UpdateClientResponseInterface {
  data: {
    msg: string;
    data: ClientInterface;
  };
}

// interface for create clients
interface CreateClientRequestInterface {
  data: {
    name: string;
    website: string;
    vimeoFolderName: string;
  };
}
// response
interface CreateClientResponseInterface {
  data: {
    msg: string;
    newClient: ClientInterface;
  };
}

interface PayloadClientInterface {
  client: ClientInterface;
}

export {
  ClientInterface,
  PayloadClientInterface,
  CreateClientRequestInterface,
  GetAllClientRequestInterface,
  UpdateClientRequestInterface,
  CreateClientResponseInterface,
  UpdateClientResponseInterface,
  GetAllClientResponseInterface,
};
