import { LoggedInUserInterface } from "@/interface/user-selector-interface";

interface CommentBoxInterface {
  videoProjectId: string;
  clientId: string;
  draftId: string;
  currentUser: { name: string; userId: string };
  commentsData: CommentInterface[];
  handleAddComments: ({
    comment,
    videoProjectId,
    clientId,
    currentUser,
  }: {
    comment: string;
    videoProjectId: string;
    clientId: string;
    videoDraftId: string;
    currentUser: { name: string; userId: string };
  }) => void;
}

interface CommentInterface {
  comment: string;
  createdAt: string;
  userId: LoggedInUserInterface;
  _id: string;
  name?: string;
}

export { CommentBoxInterface, CommentInterface };
