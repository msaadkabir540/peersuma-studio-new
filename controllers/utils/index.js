const fs = require('fs');
require('dotenv').config();
const path = require('path');
const { s3, transcoder } = require('../../utils/aws.js');
const {
  checkS3Files,
  checkJobStatus,
  waitForFileToAppearAndDelete,
} = require('../../utils/helper');
const { VideoProject } = require('../../models/VideoProject.js');

const downloadFile = async (req, res) => {
  // get the S3 file URL from the request query

  try {
    const { Key, fileName } = req.query;

    const newKey = decodeURIComponent(Key);

    console.log('newKey', newKey);
    let data;
    try {
      data = await s3
        .getObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key,
        })
        .promise();
    } catch (error) {
      data = await s3
        .getObject({
          Bucket: 'dev-peersuma-studio',
          Key,
        })
        .promise();
    }

    // let data = await s3
    //   .getObject({
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key,
    //   })
    //   .promise();
    // console.log({ data });
    // if (!data) {
    //   data = await s3
    //     .getObject({
    //       Bucket: 'dev-peersuma-studio',
    //       Key,
    //     })
    //     .promise();
    // }
    console.log({ data });

    // save the file to the local filesystem
    fs.writeFileSync(fileName, data.Body);
    const filepath = path.resolve(__dirname, '..', '..', fileName);
    res.download(filepath, fileName, () => {
      fs.unlinkSync(filepath);
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error });
  }
};

const getVideoDuration = async (req, res) => {
  try {
    let { keys } = req.query;

    keys = keys.split(',');

    await checkS3Files({
      keysList: keys,
      maxWait: 120,
    });

    const params = {
      Inputs: keys.map((x) => ({ Key: x })),
      PipelineId: '1677586918889-ykjof9', // replace with your pipeline ID
      OutputKeyPrefix: 'metadata/',
      Outputs: keys.map((x) => ({
        Key: x + '-metadata.json',
        PresetId: '1674724737117-2f90zt', // JSON output preset
        Captions: {
          CaptionFormats: [{ Format: 'srt', Pattern: '{filename}_{language}' }],
          // MergePolicy: "Override",
          CaptionSources: [{ Key: x, Language: 'en' }],
        },
      })),
    };

    const mergeResult = await transcoder.createJob(params).promise();

    console.info(`Job created to Get Video Durations`);

    let status = await checkJobStatus(mergeResult.Job.Id);

    console.info(`Job ${mergeResult.Job.Id} is ${status}.`);

    while (status !== 'Complete') {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds
      status = await checkJobStatus(mergeResult.Job.Id);
    }

    await Promise.all(
      keys.map(async (x) => {
        await waitForFileToAppearAndDelete(x + '-metadata.json');
      })
    );

    return res.status(200).json({
      durations: mergeResult?.Job?.Outputs.map((x) => x?.DurationMillis),
    });
  } catch (error) {
    return res.status(401).json({ error });
  }
};

const paginate = async (
  Model,
  query,
  sortObject,
  page = 1,
  limit = 10,
  populateFields = []
) => {
  try {
    const totalCount = await Model.countDocuments(query);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let populateOptions = populateFields.join(' ');

    const data = await Model.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit))
      .populate(populateOptions)
      .lean();

    return {
      data,
      count: data.length,
      totalCount: totalCount,
    };
  } catch (err) {
    console.error('[pagination]-error', err);
    throw new Error('Error during pagination');
  }
};

const getUniqueProjectName = async ({ clientId }) => {
  // Simulate checking in MongoDB
  let projectName = 'Untitled - 1';
  let projectExists = true;
  let counter = 1;
  while (projectExists) {
    // Simulate checking if project name exists in MongoDB
    const existingProject = await VideoProject.findOne({
      name: projectName,
      clientId: clientId,
    });
    if (existingProject) {
      projectName = `${projectName.split(' - ')[0]} - ${counter}`;
      counter++;
    } else {
      projectExists = false;
    }
  }

  return projectName;
};

module.exports = {
  downloadFile,
  getVideoDuration,
  paginate,
  getUniqueProjectName,
};
