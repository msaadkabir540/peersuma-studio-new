interface SpeakerInterface {
  startTime: string;
  endTime: string;
  type: string;
  speakerLabel: string;
  text: string;
}

export const groupByConsecutiveSpeakerLabel = (data: SpeakerInterface[]) => {
  const result = [];
  let currentGroup = [] as SpeakerInterface[];

  for (let i = 0; i < data?.length; i++) {
    if (i === 0 || data[i]?.speakerLabel === data[i - 1]?.speakerLabel) {
      currentGroup?.push(data[i]);
    } else {
      result?.push(currentGroup);
      currentGroup = [data[i]];
    }
  }

  if (currentGroup?.length > 0) {
    result?.push(currentGroup);
  }

  return result;
};

export const extractNumbersFromString = (str: string) => {
  return str?.match(/\d+/g);
};

export const getFullNameByFirstNLastName = (obj: { firstName: string; lastName: string }) => {
  const capitalizedFirstName = obj?.firstName?.charAt(0)?.toUpperCase() + obj?.firstName?.slice(1);
  const capitalizedLastName = obj?.lastName?.charAt(0)?.toUpperCase() + obj?.lastName?.slice(1);
  return `${capitalizedFirstName ?? ""} ${capitalizedLastName ?? ""}`;
};
