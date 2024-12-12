const { default: mongoose } = require('mongoose');
const { transcoder, s3 } = require('./aws');

const { ObjectId } = mongoose.Types;

const checkS3Files = async ({ keysList, maxWait = 60 }) => {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWait * 1000) {
    const headObjectPromises = keysList.map(async (Key) => {
      const file = await s3.headObject({ Key }).promise();
      console.log(file?.ContentLength, '--');
    });
    try {
      await Promise.all(headObjectPromises);
      console.log('All files found in S3 bucket.');
      return true;
    } catch (err) {
      console.log(`Error checking S3 files: ${err}. Retrying in 5 seconds.`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  console.log('Timeout reached. Not all files were found in S3 bucket.');
  return false;
};

const checkJobStatus = async (jobId) => {
  try {
    const job = await transcoder.readJob({ Id: jobId }).promise();
    console.log(`Job ${jobId} is currently in ${job.Job.Status} status.`);
    job.Job.Status === 'Error' &&
      console.log({ Output: job.Job.Output, Outputs: job.Job.Outputs });
    if (job.Job.Status === 'Error') {
      console.error(
        `Transcoding job ${jobId} failed due to ${job.Job.Status} status`
      );
      throw new Error(
        job?.Job?.Output?.StatusDetail.split?.(':')?.[1] ||
          job?.Job?.Output?.StatusDetail
      );
    }
    return job.Job.Status;
  } catch (err) {
    console.error(`Error checking job status: ${err}`);
    throw new Error(err.message);
  }
};

const waitForFileToAppearAndDelete = async (Key) => {
  const startTime = Date.now();
  while (Date.now() - startTime < 60 * 1000) {
    const deleteFile = async () => {
      await s3
        .deleteObject({
          Key,
        })
        .promise();
    };
    try {
      await deleteFile();
      console.log(`File deleted Successfully.`);
      break;
    } catch (err) {
      console.log(`Error checking S3 files: ${err}. Retrying in 5 seconds.`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

const deleteS3Folder = async (folderPath) => {
  const listParams = {
    Prefix: folderPath,
  };

  try {
    let objects = await s3.listObjectsV2(listParams).promise();

    // If the folder is empty, return immediately
    if (!objects.KeyCount) {
      console.log(`Folder ${folderPath} is already empty`);
      return;
    }

    // Delete all objects in the folder recursively
    objects = objects.Contents.map(({ Key }) => ({ Key }));
    await s3
      .deleteObjects({
        Delete: { Objects: objects, Quiet: true },
      })
      .promise();

    // Check if there are more objects to delete and continue deleting if necessary
    if (objects.IsTruncated) {
      await deleteS3Folder(folderPath);
    }
  } catch (error) {
    console.error(`Error deleting folder ${folderPath}: ${error}`);
  }
};

const callWithTimeout = ({
  fn,
  params = {},
  timeout = 30 * 60 * 1000,
  interval = 5 * 1000,
}) => {
  try {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const result = await fn({ ...params });

          if (result?.abort) {
            clearInterval(intervalId);
            reject(new Error(result?.response));
          }
          if (result?.completed) {
            clearInterval(intervalId);
            resolve(result);
          }
        } catch (error) {
          console.error('Error calling function:', error);
          clearInterval(intervalId);
          reject(error);
        }
      }, interval);

      setTimeout(() => {
        clearInterval(intervalId);
        reject(new Error('Function call timed out.'));
      }, timeout);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  ObjectId,
  checkS3Files,
  checkJobStatus,
  deleteS3Folder,
  callWithTimeout,
  waitForFileToAppearAndDelete,
};
