interface ForgotPassWordFormInterface {
  email: string;
}

interface LoginFromInterface {
  emailContact: string;
  password: string;
}

interface ResetPasswordFromInterface {
  password: string;
  password2: string;
}

interface Users {
  id: string;
  _id: string;
  username: string;
  firstName: string;
  fullName?: string;
  lastName: string;
  email: string;
  status: boolean;
  roles: string[];
  clientId: {
    _id: string;
    name: string;
    website: string;
    vimeoFolderId: string;
    vimeoFolderName: string;
    createdAt: string;
    updatedAt: string;
    status: boolean;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface GetAllUsersInterface {
  users: Users[];
  count: number;
  error?: any;
}

export {
  ForgotPassWordFormInterface,
  LoginFromInterface,
  ResetPasswordFromInterface,
  GetAllUsersInterface,
  Users,
};
