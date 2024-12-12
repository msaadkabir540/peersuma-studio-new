require('dotenv').config();

const { AlbumShot } = require('../../models/AlbumShot');
const Project = require('../../models/Project');
const User = require('../../models/User');
const { s3, transcribe } = require('../../utils/aws');
const { sentEmail } = require('../../utils/emailByPostmark');
const { sendEmailToUserOnEditing } = require('./email services');

const transcribeVideo = async ({ TranscriptionJobName, Key }) => {
  try {
    let transcription = [];
    let transcriptionSuccessful = false;
    TranscriptionJobName = `${TranscriptionJobName}_${Math.ceil(
      Math.random() * 1000000000000000
    )}`;

    // Create a transcription job
    const ex = Key.split('.');
    const MediaFormat = ex[ex.length - 1];
    const params = {
      LanguageCode: 'en-US',
      Media: {
        MediaFileUri: `s3://${process.env.AWS_BUCKET_NAME}/${Key}`,
      },
      MediaFormat,
      TranscriptionJobName,
      OutputBucketName: process.env.AWS_BUCKET_NAME,
      Settings: {
        ShowSpeakerLabels: true, // Enable speaker labels for diarization
        MaxSpeakerLabels: 10, // Set the expected number of speakers (between 2 and 10)
      },
    };

    await transcribe.startTranscriptionJob(params).promise();

    // Wait for the transcription job to complete
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (ex) {
      //keep it running
      const transcriptionJob = await transcribe
        .getTranscriptionJob({ TranscriptionJobName })
        .promise();

      console.log(transcriptionJob.TranscriptionJob.TranscriptionJobStatus);
      if (
        transcriptionJob?.TranscriptionJob?.TranscriptionJobStatus ===
        'COMPLETED'
      ) {
        transcriptionSuccessful = true;
        break;
      }
      if (
        transcriptionJob?.TranscriptionJob?.TranscriptionJobStatus === 'FAILED'
      ) {
        break;
      }
      console.log('Transcription job not yet completed...');
      await sleep(5000);
    }

    let transcript;
    if (transcriptionSuccessful) {
      // Download the transcription results from the output bucket
      const transcriptFile = await s3
        .getObject({
          Key: `${TranscriptionJobName}.json`,
        })
        .promise();

      await s3
        .deleteObject({
          Key: `${TranscriptionJobName}.json`,
        })
        .promise();

      // Delete the transcription job
      await transcribe
        .deleteTranscriptionJob({ TranscriptionJobName })
        .promise();

      transcript = JSON.parse(transcriptFile.Body.toString('utf-8'));
      // Print the transcript with timestamps for each word

      transcription = transcript.results.items.map((item, index) => {
        // Convert the timestamps to minutes and seconds
        const prevEndTime = index
          ? getTimeHoursMinSecMillSec(
              transcript.results.items[index - 1].end_time
            )
          : 0;
        const nextStartTime =
          index + 1 < transcript.results.items.length
            ? getTimeHoursMinSecMillSec(
                transcript.results.items[index + 1].start_time
              )
            : prevEndTime;

        const startTime =
          item.type === 'punctuation'
            ? prevEndTime
            : getTimeHoursMinSecMillSec(item.start_time);

        const endTime =
          item.type === 'punctuation'
            ? nextStartTime
            : getTimeHoursMinSecMillSec(item.end_time);

        return {
          startTime,
          endTime,
          type: item.type,
          speakerLabel: item?.speaker_label,
          text: item?.alternatives[0].content,
        };
      });
    }

    return {
      transcription,
      speakers: transcript?.results?.speaker_labels?.speakers,
    };
  } catch (error) {
    console.error({ error });
    throw error;
  }
};

const getTimeHoursMinSecMillSec = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor(time - hours * 3600 - minutes * 60);
  const milliseconds = Math.round(
    (time - hours * 3600 - minutes * 60 - seconds) * 1000
  );

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

const findAndSendEmailToUser = async ({ albumId }) => {
  try {
    const albumShot = await AlbumShot.find({ album: albumId });

    if (!albumShot) {
      return false;
    }

    const inviteIds = albumShot.reduce((acc, shot) => {
      const shotInviteIds = shot.invites.map((invite) => invite?.id);
      return acc.concat(shotInviteIds);
    }, []);
    const uniqueInviteIds = [...new Set(inviteIds)];

    await Promise.all(
      uniqueInviteIds?.map(async (id) => {
        const getUserById = await User.findById(id);
        if (!getUserById) {
          throw new Error(`Video Request with ID ${videoRequestId} not found`);
        }
        let emailFormatResult;

        emailFormatResult = sendEmailToUserOnEditing({
          email: getUserById?.email,
          assignToName: getUserById?.username || getUserById?.fullName,
        });
        await sentEmail(emailFormatResult);
      })
    );

    return { msg: 'success' };
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getFinalVideoMergedData = async ({
  projectId,
  templateId,
  templateUuid,
}) => {
  const project = await Project.findById(projectId).lean();
  if (!project) {
    return res.status(400).json({ msg: 'Project not found' });
  }
  const getTheTemplate = project.templates.find((template) => {
    return (
      template?.id?.toString() === templateId &&
      template?.uuid?.toString() === templateUuid &&
      template?.similarTemplates !== undefined
    );
  });

  const finalVideosVariable = getTheTemplate?.fields?.reduce((acc, field) => {
    if (field.type === 'video' && field.finalVideo) {
      Object.assign(acc, field.finalVideo);
    }
    return acc;
  }, {});

  return finalVideosVariable;
};

module.exports = {
  transcribeVideo,
  findAndSendEmailToUser,
  getFinalVideoMergedData,
};
