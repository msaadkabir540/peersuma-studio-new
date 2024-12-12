import { ClientInterface } from "./client-interface";
// interface for Logg in User
interface LogginInterface {
  users: {
    loggedInUser?: LoggedInUserInterface;
    users?: LoggedInUserInterface[];
  };
}
// interface for all Clients
interface ClientsStateInterface {
  clients: ClientsInterface;
}
interface SeletedStateInterface {
  selectedClient: string;
}

interface CurrentClinetInterface {
  name: string;
  clients: string;
  status: string;
  selectedClient: string;
  currentClient: string;
}

interface ClientsInterface {
  clients: ClientInterface[];
  selectedClient?: string;
  currentClient?: CurrentClinetInterface;
}

interface CurrentClientInterface {
  currentClient?: ClientsStateInterface;
}

interface LoggedInUserInterface {
  _id: string;
  username: string;
  fullName?: string;
  email: string;
  password: string;
  roles: [];
  createdAt: string;
  updatedAt: string;
  token: string;
  status: string;
}

export {
  LoggedInUserInterface,
  ClientsInterface,
  CurrentClientInterface,
  LogginInterface,
  ClientsStateInterface,
  SeletedStateInterface,
};
