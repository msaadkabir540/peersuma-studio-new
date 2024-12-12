import { CommentInterface } from "@/pages/create-project/components/drafts/comments/comment-box.interface";
import { LoggedInUserInterface } from "./user-selector-interface";
import { VideoProjectsInterface } from "@/context/create-project/context-interface";

interface VideoData {
  videoProjectId: string | undefined;
  clientId: string;
  item: {
    url: string;
    name: string;
    s3Key: string;
    fileType: string;
    duration: number;
    thumbnailUrl: string;
    _id: string;
    id: string;
    clipDuration: number;
  };
}

interface DraftVideoInterface {
  url: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  thumbnailUrl: string;
  _id: string;
}

interface VideoDraftInterface {
  _id: string;
  videoProjectId: string;
  clientId: string;
  draftVideo: DraftVideoInterface[];
  comments: CommentInterface[];
  createdByUser?: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoDraftComponentInterface {
  videoProjects: VideoProjectsInterface;
  currentAllUser: LoggedInUserInterface[];
  videoDrafts: VideoDraftInterface[];
  handleAddComments: () => void;
  selectedClient: string;
  currentUser: { name: string; userId: string };
}

interface VideoProjectByIdInterface {
  videoProjectId: string;
  status: {
    oldStatus: string;
    statusChangeFrom: string;
    email: string | undefined;
    userName: string | undefined;
    status: string;
  };
}

export {
  VideoData,
  VideoDraftInterface,
  DraftVideoInterface,
  VideoDraftComponentInterface,
  VideoProjectByIdInterface,
};
