interface EmbedWidgetThumbInterface {
  textColor: string;
  thumbnailColor: string;
  thumbnailTitleColor: string;
  avatarColor: string;
  item: EmbedWidgetInterface;
  selected: boolean;
  handleSelect: ({ item }: { item: EmbedWidgetInterface }) => void;
}

interface EmbedWidgetInterface {
  duration?: number;
  updatedAt?: string | undefined;
  name: string;
  thumbnailUrl?: string;
}

interface customEmbedWidgetThumbInterface {
  thumbMain: string;
  thumbImage: string;
  thumbTimeContainer: string;
  thumbText: string;
}

export { EmbedWidgetInterface, EmbedWidgetThumbInterface, customEmbedWidgetThumbInterface };
