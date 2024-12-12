type TranscriptionInterface = {
  endTime: string;
  speakerLabel: string;
  startTime: string;
  text: string;
  type: string;
};

type MediaShortInterface = {
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
};
// interface for add Album short Response
interface AddAlbumShotResponseInterface {
  album?: string;
  createdAt: string;
  description?: string;
  dueDate?: string;
  invites?: string;
  isDefault?: string;
  media?: MediaShortInterface[];
  name: string;
  shotUrl: string;
  updatedAt?: string;
  _id: string;
}

interface AddAlbumShotRequestInterface {
  album: string;
  name: string;
  dueDate?: string;
  description?: string;
}

//interface for the add album short request data
interface UpdateAddAlbumShotResponseInterface {
  album?: string;
  createdAt: string;
  description?: string;
  dueDate?: string;
  invites?: string;
  isDefault?: string;
  media?: MediaShortInterface[];
  name: string;
  shotUrl: string;
  updatedAt?: string;
  _id: string;
}

interface UpdateAlbumShotRequestInterface {
  id: string;
  album: string;
  name: string;
  dueDate?: string;
  description?: string;
}

// interface for the upload media Request

interface UploadMediaRequestInterface {
  id: string;
  data: {
    name: string;
    url: string;
    fileType: string;
    fileSize: number;
    duration?: number | undefined;
    s3Key: string;
    thumbnailUrl?: string;
    thumbnailS3Key?: string;
  };
}

// interface for the upload media shortURl request
interface shortURlRequestInterface {
  id: string;
  data: { shotUrl: string };
}

// interface for the upload media shortURl request
interface UpdateShotVisibilityRequestInterface {
  id: string;
  params: { isVisible: boolean };
}

// interface for the upload media

interface RemoveAlbumShotMediaInterface {
  albumshotId?: string | undefined;
  mediaIdsToDelete?: string | undefined | string[];
}

interface RemoveAlbumShotMediaRequestInterface {
  params: RemoveAlbumShotMediaInterface;
}

interface InvitationUserEmailInterface {
  data: {
    subject: string;
    body: HTMLBodyElement;
    albumshotId: string;
    userId: string;
  };
}

export {
  shortURlRequestInterface,
  UploadMediaRequestInterface,
  AddAlbumShotRequestInterface,
  InvitationUserEmailInterface,
  AddAlbumShotResponseInterface,
  RemoveAlbumShotMediaInterface,
  UpdateAlbumShotRequestInterface,
  UpdateAddAlbumShotResponseInterface,
  RemoveAlbumShotMediaRequestInterface,
  UpdateShotVisibilityRequestInterface,
};
