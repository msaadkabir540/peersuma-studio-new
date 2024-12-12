interface AddThemesInterface {
  themesDescription: string;
  themeName: string;
  themes_py: string;
  sampleVideoUrl?: string;
  sampleVideoS3Key?: string;
}

interface GetAllThemesInterface {
  params?:
    | {
        prefix?: string;
        selectBox?: boolean;
        sortBy?: string;
        sortOrder?: string;
      }
    | undefined;
}

export { AddThemesInterface, GetAllThemesInterface };
