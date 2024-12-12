interface InlineStyleRangeInterface {
  offset: number;
  length: number;
  style: string;
}

interface EntityRangeInterface {
  offset: number;
  length: number;
  key: number;
}

interface BlockInterface {
  key: string;
  text: string;
  type: string;
  depth: number;
  inlineStyleRanges: InlineStyleRangeInterface[];
  entityRanges: EntityRangeInterface[];
  data: any;
}

interface BodyInterface {
  blocks: BlockInterface[];
  entityMap: any;
}

interface EmailDataInterface {
  subject: string;
  body: BodyInterface;
  submitHandler?: (argu: any) => void;
}

export { EmailDataInterface, BodyInterface };
