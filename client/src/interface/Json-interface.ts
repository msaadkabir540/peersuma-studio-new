interface MergeInterface {
  find: string;
  replace: string;
}

interface OutputInterface {
  format: string;
  size: {
    width: number;
    height: number;
  };
  fps: number;
  destinations: {
    provider: string;
    exclude: boolean;
  };
}

interface TimeLineInterface {
  timeline?: {
    soundtrack?: {
      src?: string;
      effect?: string;
      volume?: string;
    };
    background?: string;
    fonts?: {
      src?: string;
    }[];
    tracks?: {
      clips?: {
        asset?: {
          type: string;
          html?: string;
          css?: string;
          src?: string;
          trim?: string;
          volume?: string;
          volumeEffect?: string;
          speed?: string;
          crop?: {
            top: string;
            bottom: string;
            left: string;
            right: string;
          };
        };
        start: string;
        length: string;
        position: string;
        offset: {
          y: string;
          x: string;
        };
        transition: {
          in: string;
          out: string;
        };
        effect?: string;
        filter?: string;
        opacity?: string;
        transform?: {
          rotate?: {
            angle: string;
          };
        };
      }[];
    }[];
  };
}

interface SSJsonObjectInterface {
  timeline: TimeLineInterface[] | undefined;
  output: OutputInterface[] | undefined;
  merge: MergeInterface[] | undefined;
}

export { SSJsonObjectInterface };
