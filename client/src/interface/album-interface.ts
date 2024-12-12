// interface for Get all Album of selected CLient

interface TranscriptionInterface {
  endTime: string;
  speakerLabel: string;
  startTime: string;
  text: string;
  type: string;
}

interface MediaInterface {
  createdAt?: string;
  duration?: number | undefined;
  fileType: string | undefined;
  isVisible: boolean | undefined;
  name: string | undefined;
  s3Key: string | undefined;
  speakers?: number;
  thumbnailS3Key: string | undefined;
  thumbnailUrl: string | undefined;
  transcription?: TranscriptionInterface[];
  updatedAt?: string;
  url: string | undefined;
  _id: string;
}

interface AlbumInterface {
  album: string;
  createdAt: string;
  isDefault: boolean;
  media: MediaInterface[];
  name: string;
  shotUrl: string;
  updatedAt: string;
  _id: string;
}

interface ClientInterface {
  _id: string;
  name: string;
  status: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  vimeoFolderId: string;
  vimeoFolderName: string;
}

interface GetAllAlbumsInterface {
  albumshots: AlbumInterface[];
  clientId?: ClientInterface;
  createdAt: string;
  description: string;
  name: string;
  producers?: any[];
  status: string;
  updatedAt: string;
  _id: string;
  data?: GetAllAlbumsdParamsInterface[];
  loading?: boolean;
}

// interface fro Update Albums

interface UpdateAlbumsInterface {
  msg: string;
  updateData: {
    albumshots: any[];
    clientId: string;
    createdAt?: string;
    description?: string;
    name?: string;
    producers?: string;
    status?: string;
    updatedAt?: string;
    _id?: string;
  };
}

interface GetAllAlbumsdParamsInterface {
  search: string;
  status: string;
  producer: string;
  sortOrder: string;
  sortBy: string;
}

export {
  GetAllAlbumsInterface,
  UpdateAlbumsInterface,
  GetAllAlbumsdParamsInterface,
  MediaInterface,
};
