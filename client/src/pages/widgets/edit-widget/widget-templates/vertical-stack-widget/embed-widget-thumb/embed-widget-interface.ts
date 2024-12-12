interface EmbedWidgetInterface {
  duration?: number;
  name: string;
  thumbnailUrl?: string;
  updatedAt?: string;
}

interface customEmbedWidgetThumbInterface {
  thumbMain: string;
  playButton: string;
  thumbImage: string;
  thumbTimeContainer: string;
  thumbText: string;
  uploadedContainer: string;
  uploadedNameClass: string;
  avatar: string;
  uploadedheadingClass: string;
  uploadedTimeClass: string;
}

export { EmbedWidgetInterface, customEmbedWidgetThumbInterface };
