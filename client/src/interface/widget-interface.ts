// interface from Get all Widget

interface GetAllWidgetRequestInterface {
  params: {
    clientId: string;
  };
}
// response

interface GetAllWidgetResponseInterface {
  _id: string;
  name: string;
  active: string;
}

export { GetAllWidgetRequestInterface, GetAllWidgetResponseInterface };
