interface VimeoPlayerInterface {
  url: string;
  handleSetLoading: () => void;
  handleSetVideoTime: ({ value }: { value: number | null }) => void;
}

interface CustomErrorSchema {
  message: string;
}

interface ReactPlayerRefInterface {
  getCurrentTime: () => void;
}

export { VimeoPlayerInterface, CustomErrorSchema, ReactPlayerRefInterface };
