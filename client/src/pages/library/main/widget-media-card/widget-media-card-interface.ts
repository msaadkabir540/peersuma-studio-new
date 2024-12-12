interface WidgetMediaCardInterface {
  _id: string;
  name: string;
  thumbnailUrl: string;
  widgetId: string;
  order: number;
  handleMoveWidgetMediaLibrary: ({ order }: { order: number }) => void;
  handleRemoveWidgetMediaLibrary: ({ widgetID }: { widgetID: string }) => void;
}

export { WidgetMediaCardInterface };
