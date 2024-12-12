const fs = require('fs');
const moment = require('moment/moment');
const { spawn } = require('child_process');
const Shotstack = require('shotstack-sdk');

const Project = require('../../models/Project');
const Template = require('../../models/Template');
const Themes = require('../../models/Themes');

const { s3, transcoder } = require('../../utils/aws');
const {
  checkJobStatus,
  checkS3Files,
  deleteS3Folder,
  ObjectId,
} = require('../../utils/helper');
const { randomUUID } = require('crypto');
const { Album } = require('../../models/Album');
const { VideoProject } = require('../../models/VideoProject');
const { findAndSendEmailToUser, getFinalVideoMergedData } = require('./helper');

const { sendEmailToUserOnEditing } = require('./email services');
const { sentEmail } = require('../../utils/emailByPostmark');

require('dotenv').config();

const pythonScriptPath = './public/test.py';

const add = async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
    });
    return res
      .status(200)
      .json({ msg: 'Project Created successfully', newProject });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const requestTemplates = req?.body?.templates || [];

    const project = await Project.findById(id).lean();
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    let needsUpdate = false;

    const updatePromises = requestTemplates.map(
      async (template, templateIndex) => {
        const existingTemplate = project.templates?.[templateIndex];

        if (existingTemplate) {
          await Promise.all(
            (template.fields || []).map(async (field, fieldIndex) => {
              const existingField = existingTemplate.fields?.[fieldIndex];

              if (field.type === 'video' && existingField?.type === 'video') {
                const requestValues = field.value || [];
                const existingValues = existingField.value || [];

                if (
                  requestValues.length !== existingValues.length ||
                  !requestValues.every(
                    (val, idx) => val.id === existingValues[idx]?.id
                  )
                ) {
                  const videosToMerge = {};
                  const otherFields = {};

                  for (const templateField of template.fields || []) {
                    if (templateField.type === 'video') {
                      videosToMerge[templateField.name] = (
                        templateField.value || []
                      ).map((item) => ({
                        name: item?.name,
                        s3Key: item?.s3Key || item?.name,
                        startTime: item?.startTime
                          ? parseFloat(item.startTime.toFixed(2))
                          : null,
                        endTime: item?.endTime
                          ? parseFloat(item.endTime.toFixed(2))
                          : null,
                        duration: item?.duration
                          ? parseFloat(item.duration.toFixed(2))
                          : null,
                      }));
                    } else {
                      otherFields[templateField.name] =
                        templateField.value || null;
                    }
                  }

                  // Clean up empty fields
                  for (const key in videosToMerge) {
                    if (
                      Array.isArray(videosToMerge[key]) &&
                      videosToMerge[key].length === 0
                    ) {
                      delete videosToMerge[key];
                    }
                  }
                  for (const key in otherFields) {
                    if (otherFields[key] === null || otherFields[key] === '') {
                      delete otherFields[key];
                    }
                  }

                  const variables = {
                    videosToMerge,
                    ...otherFields,
                  };

                  const { variables: updatedVariables } =
                    await mergeAndUpdateVariables({
                      id: template.id,
                      variables,
                    });

                  for (const [fieldIndex, field] of (
                    template.fields || []
                  ).entries()) {
                    if (
                      field.type === 'video' &&
                      updatedVariables.hasOwnProperty(field.name)
                    ) {
                      const videoUrl = updatedVariables[field.name];

                      field.finalVideo = field.finalVideo || {};
                      field.finalVideo[field.name] = videoUrl;

                      for (const key in updatedVariables) {
                        if (key !== field.name && key.includes(field.name)) {
                          field.finalVideo[key] = updatedVariables[key];
                        }
                      }
                    }
                  }
                  needsUpdate = true;
                }
              }
            })
          );
        } else {
          await Promise.all(
            (template.fields || []).map(async (field) => {
              if (field.type === 'video') {
                const videosToMerge = {};
                const otherFields = {};

                for (const templateField of template.fields || []) {
                  if (templateField.type === 'video') {
                    videosToMerge[templateField.name] = (
                      templateField.value || []
                    ).map((item) => ({
                      name: item?.name,
                      s3Key: item?.s3Key || item?.name,
                      startTime: item?.startTime
                        ? parseFloat(item.startTime.toFixed(2))
                        : null,
                      endTime: item?.endTime
                        ? parseFloat(item.endTime.toFixed(2))
                        : null,
                      duration: item?.duration
                        ? parseFloat(item.duration.toFixed(2))
                        : null,
                    }));
                  } else {
                    otherFields[templateField.name] =
                      templateField.value || null;
                  }
                }

                for (const key in videosToMerge) {
                  if (
                    Array.isArray(videosToMerge[key]) &&
                    videosToMerge[key].length === 0
                  ) {
                    delete videosToMerge[key];
                  }
                }
                for (const key in otherFields) {
                  if (otherFields[key] === null || otherFields[key] === '') {
                    delete otherFields[key];
                  }
                }

                const variables = {
                  videosToMerge,
                  ...otherFields,
                };

                const { variables: updatedVariables } =
                  await mergeAndUpdateVariables({
                    id: template.id,
                    variables,
                  });

                for (const [fieldIndex, field] of (
                  template.fields || []
                ).entries()) {
                  if (
                    field.type === 'video' &&
                    updatedVariables.hasOwnProperty(field.name)
                  ) {
                    const videoUrl = updatedVariables[field.name];

                    field.finalVideo = field.finalVideo || {};

                    field.finalVideo[field.name] = videoUrl;

                    for (const key in updatedVariables) {
                      if (key !== field.name && key.includes(field.name)) {
                        field.finalVideo[key] = updatedVariables[key];
                      }
                    }
                  }
                }

                needsUpdate = true;
              }
            })
          );
        }
      }
    );

    // Await all promises
    await Promise.all(updatePromises);

    // Perform the update
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true }
    );

    return res.status(200).json({
      msg: 'Project Updated successfully!',
      newProject: updatedProject,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err?.message });
  }
};

const updateProjectName = async (req, res) => {
  try {
    const { id } = req.params;

    const newProject = await Project.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    if (!newProject) {
      return res.status(404).json({ msg: 'Unable To Update Project' });
    }

    await Album.findOneAndUpdate(
      { _id: ObjectId(newProject?.albumId) },
      {
        $set: {
          name: req.body.projectName,
        },
      },
      { new: true }
    );
    await VideoProject.findOneAndUpdate(
      { _id: ObjectId(newProject?.videoProjectId) },
      {
        $set: {
          name: req.body.projectName,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: 'Project Updated successfully!', newProject });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err?.message });
  }
};

const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectStatus } = req.body;

    const newProject = await Project.findByIdAndUpdate(id, {
      projectStatus,
    });
    if (!newProject) {
      return res.status(404).json({ msg: 'Unable To Update Project Status' });
    }

    return res
      .status(200)
      .json({ msg: 'Project Status Updated successfully!' });
  } catch (err) {
    console.error(err);
  }
};

const updateProcessingStatus = async (req, res) => {
  try {
    const { id, status } = req.query;

    const statusValue = status.toLowerCase() === 'true';
    const newProject = await Project.findById(id);
    if (!newProject) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const albumData = newProject.albumId;
    const videoProjectData = newProject.videoProjectId;

    const updateAlbum =
      await Album.findById(albumData).populate('createdByUser');
    if (!updateAlbum) {
      return res.status(404).json({ msg: 'Album not found' });
    }

    const updateVideoProject = await VideoProject.findById(videoProjectData);
    if (!updateVideoProject) {
      return res.status(404).json({ msg: 'Video Project not found' });
    }

    updateVideoProject.isEditingProcess = statusValue;
    await updateVideoProject.save();

    updateAlbum.isEditingProcess = statusValue;
    await updateAlbum.save();

    newProject.isEditingProcess = statusValue;
    await newProject.save();

    if (statusValue) {
      emailFormatResult = sendEmailToUserOnEditing({
        email: updateAlbum?.createdByUser?.email,
        assignToName:
          updateAlbum?.createdByUser?.username ||
          updateAlbum?.createdByUser?.fullName,
      });
      await sentEmail(emailFormatResult);
      await findAndSendEmailToUser({ albumId: updateAlbum?._id });
    }
    // Send success response
    return res.status(200).json({ msg: 'success' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    let { roles } = req.user;
    let { clientId } = req.query;

    if (!clientId && !['backend', 'superadmin'].includes(roles[0])) {
      return res
        .status(500)
        .json({ msg: 'Not authorized to access projects!' });
    }

    const [openedProjects, closedProjects] = await Promise.all([
      await Project.find({
        ...(clientId && { clientId: ObjectId(clientId) }),
        projectStatus: 'Opened',
      })
        .populate('videoProjectId')
        .lean(),
      await Project.find({
        ...(clientId && { clientId: ObjectId(clientId) }),
        projectStatus: 'Closed',
      })
        .populate('videoProjectId')
        .lean(),
    ]);

    return res.status(200).json({
      closedProjectsCount: closedProjects.length,
      openedProjectsCount: openedProjects.length,
      openedProjects: openedProjects.map((x) => ({
        ...x,
        mediaListCount: x?.mediaList?.length,
      })),
      closedProjects: closedProjects.map((x) => ({
        ...x,
        mediaListCount: x?.mediaList?.length,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).lean();
    if (!project) {
      return res.status(404).json({ msg: 'No project found!' });
    }
    return res.status(200).json(project);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).send({ msg: 'Project not found!' });
    }

    const s3FolderToDelete = deletedProject?.mediaList?.[0]?.url
      ?.split('.com/')?.[1]
      ?.split('/input')?.[0];
    s3FolderToDelete && (await deleteS3Folder(s3FolderToDelete));

    return res.status(200).json({ msg: 'Project Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { Key, id, keyName } = req.query;

    if (id && keyName) {
      const prevProject = await Project.findOne({
        _id: ObjectId(id),
      }).lean();
      const name =
        keyName === 'mediaList'
          ? Key.split('input/')[1]
          : Key.split('output/')[1];
      const updatedProject = await Project.findOneAndUpdate(
        { _id: ObjectId(id), [keyName]: { $exists: true } },
        {
          ...(['mediaList', 'finalVideos'].includes(keyName) && {
            $pull: { [keyName]: { name } },
            $set: {
              fields: prevProject?.fields?.map?.((x) => ({
                ...x,
                label: x.label === Key ? '' : x.label,
                value: x.label === Key ? '' : x.value,
              })),
            },
          }),
        }
      );
      if (!updatedProject) {
        return res.status(404).send({ msg: 'Project not found' });
      }
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key,
        })
        .promise();
    }

    return res.status(200).json({ msg: 'Project file Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const downloadFinalVideo = async (req, res) => {
  try {
    req.body.videos.length &&
      (await checkS3Files({
        keysList: req.body.videos,
        maxWait: 120,
      }));
    const finalFileName = Math.ceil(Math.random() * 100000) + 'final_video.mp4';
    const mergeParams = {
      // PipelineId: "1674724649778-gc6ovo",
      PipelineId: '1677586918889-ykjof9',
      Inputs: req.body.videos.map((Key) => ({
        Key,
        FrameRate: 'auto',
        Resolution: 'auto',
        AspectRatio: 'auto',
        Interlaced: 'auto',
        Container: 'auto',
      })),
      Output: {
        Key: finalFileName,
        PresetId: '1678259252357-tme22l',
      },
    };

    try {
      const mergeResult = await transcoder.createJob(mergeParams).promise();

      console.info(`Job created to merge into final video`);

      let status = await checkJobStatus(mergeResult.Job.Id);
      console.info(`Job ${mergeResult.Job.Id} is ${status}.`);

      while (status !== 'Complete') {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds
        status = await checkJobStatus(mergeResult.Job.Id);
      }

      console.info(`Job ${mergeResult.Job.Id} is complete.`);

      const startTime = Date.now();
      while (Date.now() - startTime < 60 * 1000) {
        const fetchFile = async (Key) => {
          await s3
            .putObjectAcl({
              Key,
              ACL: 'public-read',
            })
            .promise();
          const file = await s3.getObject({ Key }).promise();
          return file;
        };
        try {
          const finalFile = await fetchFile(finalFileName);
          fs.writeFileSync('./files/merged.mp4', finalFile?.Body);
          console.info(`File downloaded and saved.`);
          break;
        } catch (err) {
          console.error(
            `Error checking S3 files: ${err}. Retrying in 5 seconds.`
          );
          await new Promise((res) => setTimeout(res, 5000));
        }
      }

      // sending the final video to the user

      return res.download('./files/merged.mp4', 'final-video.mp4', async () => {
        // delete the final video file
        if (fs.existsSync('./files/merged.mp4')) {
          // fs.unlinkSync("./files/merged.mp4");
          await Promise.all(
            [finalFileName].map(
              async (Key) =>
                await s3
                  .deleteObject({
                    Key,
                  })
                  .promise()
            )
          );
        }
      });
    } catch (err) {
      console.error({ err });
      res
        .status(500)
        .json({ error: err.message || 'Error creating job to merge videos' });
    }
  } catch (err) {
    console.error({ err });
    // Handle any errors that may occur during the transcription process
    return res.status(401).json({
      msg:
        err?.message === 'Invalid URI'
          ? 'Invalid URI'
          : 'Error generating captions: please try again later.',
      err,
    });
  }
};

const getTemplateFields = async (req, res) => {
  try {
    const initialMergeBlock = {};
    let { templateId, UIpy = '' } = req.query;

    const template = await Template.findById(templateId);
    if (!template) {
      return res
        .status(401)
        .json({ msg: 'Template not found, It might be deleted!' });
    }

    UIpy = UIpy || template?.UIpy;

    const ssJson = template?.ssJson ? JSON.parse(template?.ssJson) : '';
    if (!ssJson?.merge || !UIpy) {
      return res.status(401).json({ msg: 'Invalid UIpy or SSJson!' });
    }

    const initialMergeBlockKeys = [];
    ssJson.merge.forEach(({ find, replace }) => {
      initialMergeBlock[find] = replace;
      initialMergeBlockKeys.push(find);
    });
    const scriptPath = pythonScriptPath;
    // Prepend the necessary lines to the file
    const prependContent = `
import sys
import json

v1 =  sys.argv[1]
variables =  json.loads(v1)

def GetLength(fieldName):
    try:
        return variables["len_"+fieldName]
    except KeyError:
        return 0

def getInputs(type, label, *args):
    return {
      "type": type,
      "label": label,
      "options": args
    }

fields = {}
`;

    let initiallyCreateAllVariables = '';
    initiallyCreateAllVariables += initializeInitialFieldValues({ UIpy }) || '';
    const initialValues = Object.values(initialMergeBlock);
    initialMergeBlockKeys.forEach((key, index) => {
      const type = typeof initialValues[index];
      initiallyCreateAllVariables += `\n${key} = ${
        type === 'string' ? `"${initialValues[index]}"` : initialValues[index]
      }${index === initialMergeBlockKeys.length - 1 ? '\n\n' : ''}`;
    });
    let reAssignAllVariables = '';
    initialMergeBlockKeys.forEach((key) => {
      reAssignAllVariables += `\nvariables["${key}"] = ${key}`;
    });
    const appendContent = `\n\nprint(json.dumps({"fields":fields}))`;
    fs.writeFileSync(
      scriptPath,
      prependContent +
        initiallyCreateAllVariables +
        UIpy +
        reAssignAllVariables +
        appendContent,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error saving file locally');
        }
      }
    );
    // python3
    const result = await new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        pythonScriptPath,
        JSON.stringify(initialMergeBlock),
      ]);

      pythonProcess.stdout.on('data', (data) => {
        const output = JSON.parse(data.toString().trim());
        fs.unlinkSync(pythonScriptPath);
        resolve(output);
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`${data}`);
        reject({ msg: new Error(`${data}`).message });
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          reject(new Error(`Python process exited with code ${code}`));
        }
      });
    });

    return res.status(200).json({ ...result });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ msg: err?.msg, pythonFile: pythonScriptPath });
  }
};

const generateSSJSON = async (
  { variables, templateId, templateStyleId = '', templateThemeId = '' },
  res
) => {
  try {
    const template = await Template.findById(templateId);
    // get the theme data by Id
    let themePyData = '';
    if (templateThemeId) {
      const templateThemeData = await Themes.findById(templateThemeId);
      themePyData = templateThemeData?.themes_py
        ? `\n${templateThemeData?.themes_py}\n`
        : '';
    }

    variables?.videosToMerge && delete variables?.videosToMerge;

    for (const key in variables) {
      if (
        typeof variables[key] === 'object' &&
        'value' in variables[key] &&
        'label' in variables[key]
      ) {
        variables[key] = variables[key].label;
      } else if (
        typeof variables[key] === 'string' &&
        variables[key].includes('\n')
      ) {
        variables[key] = variables[key].replace(/\n/g, '<br>');
      }
    }
    let styleCode =
      template.templateStyles.find(
        (style) => style?._id.toString() == templateStyleId
      )?.styles_py || '';

    const scriptLines = styleCode.split('\n');
    for (const key in variables) {
      const keyRegex = new RegExp(`\\b${key}\\b *= *["'][^"']*["']`, 'g');
      const replacement = `${key} = "${variables[key]}"`;
      for (let i = 0; i < scriptLines.length; i++) {
        scriptLines[i] = scriptLines[i].replace(keyRegex, replacement);
      }
    }
    styleCode = scriptLines.join('\n');
    styleCode = styleCode ? `\n${styleCode}\n` : '';

    const ssJson = JSON.parse(template?.ssJson);
    const initialMergeBlock = {};
    const initialMergeBlockKeys = [];
    ssJson.merge.forEach(({ find, replace }) => {
      initialMergeBlock[find] = replace;
      initialMergeBlockKeys.push(find);
    });

    if (template?.UIpy && template?.ssJson) {
      const scriptPath = pythonScriptPath;

      // Prepend the necessary lines to the file
      const prependContent = `
import sys
import json

v1 =  sys.argv[1]
variables =  json.loads(v1)

def GetLength(fieldName):
    try:
        return variables["len_"+fieldName]
    except KeyError:
        return 0

def getInputs(type, label, *args):
    return {
      "type": type,
      "label": label,
      "options": args
    }

fields = {}
`;
      let initiallyCreateAllVariables = '';
      initiallyCreateAllVariables +=
        initializeInitialFieldValues({ UIpy: template?.UIpy }) || '';
      const initialKeys = Object.keys({ ...initialMergeBlock, ...variables });
      const initialValues = Object.values({
        ...initialMergeBlock,
        ...variables,
      });
      // initialMergeBlockKeys.push(...[...new Set(initialKeys)]);
      initialKeys.forEach((key, index) => {
        const type = typeof initialValues[index];
        initiallyCreateAllVariables += `\n${key} = ${
          type === 'string' ? `"${initialValues[index]}"` : initialValues[index]
        }${index === initialKeys.length - 1 ? '\n\n' : ''}`;
      });

      let reAssignAllVariables = '';
      initialMergeBlockKeys.forEach((key) => {
        reAssignAllVariables += `\nvariables["${key}"] = ${key}`;
      });

      const appendContent = '\n\nprint(json.dumps({"variables":variables}))';
      const contextData =
        prependContent +
        initiallyCreateAllVariables +
        themePyData +
        styleCode +
        template?.UIpy +
        reAssignAllVariables +
        appendContent;

      try {
        fs.writeFileSync(scriptPath, contextData, (err) => {
          if (err) {
            console.error(err);
            throw new Error('Error saving file locally');
          }
        });
      } catch (err) {
        console.error('Error writing file:', err);
      }
    }
    const result = await new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        pythonScriptPath,
        JSON.stringify(variables),
        true,
      ]);

      pythonProcess.stdout.on('data', (data) => {
        try {
          // Parse the data, but catch any errors
          const output = JSON.parse(data.toString().trim());
          fs.unlinkSync(pythonScriptPath);
          resolve(output);
        } catch (error) {
          // If there's an error, return an empty string instead of crashing
          console.error(error);
          reject({ msg: new Error(`${data}`).message });
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        reject({ msg: new Error(`${data}`).message });
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          reject(new Error(`Python process exited with code ${code}`));
        }
      });
    });

    const updatedMergeBlockFields = [];
    const newVariables = { ...initialMergeBlock, ...result.variables };

    Object.keys(newVariables)
      .filter((x) => initialMergeBlockKeys.includes(x))
      .forEach((x) => {
        updatedMergeBlockFields?.push({
          find: x,
          replace: newVariables[x],
        });
      });

    ssJson.merge = updatedMergeBlockFields;

    return ssJson;
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ msg: err?.msg, pythonFile: pythonScriptPath });
    // throw new Error(err.message);
  }
};

const generateMergeBlockFields = async (req, res) => {
  try {
    let {
      variables,
      templateId,
      templateStyleId,
      templateThemeId,
      projectId,
      templateUuid,
    } = req.body;

    const finalVideosVariable = await getFinalVideoMergedData({
      projectId,
      templateId,
      templateUuid,
    });

    const ssJson = await generateSSJSON(
      {
        variables: finalVideosVariable,
        templateId,
        templateStyleId,
        templateThemeId,
      },
      res
    );

    return res.status(200).json(ssJson);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err?.msg });
  }
};

const renderTemplateVideo = async (req, res) => {
  try {
    let keysToDelete = [];
    let {
      id,
      templateId,
      templateUuid,
      templateStyleId,
      templateThemeId,
      resolution,
      quality,
      finalFileName,
    } = req.body;

    const fileNameExists = await Project.findOne({
      'finalVideos.name': new RegExp(`${finalFileName}.mp4`, 'gi'),
      'finalVideos.s3Key': new RegExp(id, 'gi'),
    });
    if (fileNameExists) {
      return res.status(500).json({ msg: 'File Name already exists!' });
    }

    const project = await Project.findById(id).lean();

    // ({ variables } = await mergeAndUpdateVariables({ id, variables }));

    const finalVideosVariable = await getFinalVideoMergedData({
      projectId: id,
      templateId,
      templateUuid,
    });

    let ssJson = await generateSSJSON({
      variables: finalVideosVariable,
      templateId,
      templateThemeId,
      templateStyleId,
    });

    const s3Destination = {
      provider: 's3',
      options: {
        region: 'us-east-1',
        bucket: process.env.AWS_BUCKET_NAME,
        prefix: `project_${id}/output`,
        filename: `${finalFileName}`,
        acl: 'public-read',
      },
    };

    const defaultClient = Shotstack.ApiClient.instance;
    defaultClient.basePath = process.env.SHOT_STACK_BASE_PATH;

    const DeveloperKey = defaultClient.authentications['DeveloperKey'];
    DeveloperKey.apiKey = process.env.SHOT_STACK_API_KEY; // use the correct API key

    const api = new Shotstack.EditApi();

    delete ssJson?.output?.size;

    ssJson = {
      ...ssJson,
      output: {
        ...(ssJson?.output || {}),
        quality: quality || 'high',
        resolution: resolution || '1080',
        destinations: [...(ssJson?.output?.destinations || []), s3Destination],
        thumbnail: {
          capture: 1,
          scale: 1,
        },
      },
    };

    const renderId = (await api.postRender(ssJson)).response.id;
    if (!renderId) {
      return res
        .status(500)
        .json({ error: 'Unable to initialize video render!' });
    }

    const createResponse = async (data) => {
      const extension = data.response.url.split('.').pop(); // get the file extension
      finalFileName = `${finalFileName}.${extension}`;
      const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/project_${id}/output/${finalFileName}`;
      return {
        response: data.response,
        video: {
          url: s3Url,
          fileType: 'video',
          name: finalFileName,
          duration: data.response.duration,
          thumbnailUrl: data.response.thumbnail,
          s3Key: `project_${id}/output/${finalFileName}`,
        },
      };
    };

    const checkRenderStatus = (renderId) => {
      return new Promise((resolve, reject) => {
        const getRenderCallback = async (data) => {
          console.info({ status: data.response.status });
          if (data.response.status === 'done') {
            clearInterval(intervalId);
            const res = await createResponse(data);
            resolve(res);
          } else if (data.response.status === 'failed') {
            console.error({ error: data.response.error });
            clearInterval(intervalId);
            reject(new Error(`Render failed: ${data.response.error}`));
          }
        };
        const intervalId = setInterval(async () => {
          const data = await api.getRender(renderId, {
            data: false,
            merged: true,
          });
          await getRenderCallback(data);
        }, 5000); // check every 5 seconds

        // set a timeout of 3 minutes (300000 ms) to prevent an infinite loop
        setTimeout(
          () => {
            clearInterval(intervalId);
            reject(new Error('Render timed out.'));
          },
          10 * 60 * 1000 // 10 min * 60 sec * 1000 ms
        );

        // immediately check the status in case the render is already done
        api
          .getRender(renderId, { data: false, merged: true })
          .then(async (data) => {
            await getRenderCallback(data);
          });
      });
    };

    const result = await checkRenderStatus(renderId);

    if (!result.video) {
      return res.status(500).json({ result });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        finalVideos: [...(project?.finalVideos || []), result.video],
      },
      {
        new: true,
        upsert: true,
      }
    );

    await Promise.all(
      keysToDelete.map(async (Key) => await s3.deleteObject({ Key }).promise())
    );
    console.info(
      'Shot Stack video is generated successfully, and all merged field videos have been deleted successfully'
    );

    return res.status(200).json(updatedProject);
  } catch (err) {
    console.error(
      err?.message ||
        err?.response?.text ||
        'Something went wrong will rendering video'
    );

    const shotStackErrors =
      err?.response?.text &&
      JSON.parse(err.response.text).response.error.details;

    return res.status(400).json({
      msg:
        (shotStackErrors?.length > 0 &&
          'Shot Stack Error: ' + JSON.stringify(shotStackErrors)) ||
        err?.message ||
        'Something went wrong will rendering video',
    });
  }
};

const mergeFinalVideo = async (req, res) => {
  try {
    let { id, finalVideosToMerge, finalFileName } = req.body;

    const fileNameExists = await Project.findOne({
      'mergeFinalVideo.name': new RegExp(`${finalFileName}.mp4`, 'gi'),
    });
    if (fileNameExists) {
      return res.status(500).json({ msg: 'File Name already exists!' });
    }

    const mergeFinalVideo = await mergeVideos({
      projectId: id,
      folder: 'output',
      fieldName: finalFileName,
      finalFileName: finalFileName,
      filesToMerge: finalVideosToMerge,
    });

    await Project.updateOne(
      { _id: ObjectId(id) },
      {
        mergeFinalVideo,
      }
    );

    return res.status(200).json(mergeFinalVideo);
  } catch (err) {
    console.error({ err });
    return res.status(400).json({
      msg: err?.message || 'Something went wrong will rendering video',
    });
  }
};

const initializeInitialFieldValues = ({ UIpy }) => {
  // Initialize variables based on field types
  var initializeFieldsVariables = {};

  // Regular expression pattern to extract field names and types
  var pattern = /fields\["(.*?)"]=getInputs\("(\w+)",/g;
  var match;

  // Iterate through matches and initialize variables accordingly
  while ((match = pattern.exec(UIpy)) !== null) {
    var fieldName = match[1];
    var fieldType = match[2];

    // Initialize variable based on field type
    initializeFieldsVariables[fieldName] = fieldType === 'number' ? 0 : '';
  }

  // Print the initialized variables
  let initiallyCreateAllVariables = '';
  const initialFieldKeys = Object.keys(initializeFieldsVariables);
  const initialFieldValues = Object.values(initializeFieldsVariables);
  initialFieldKeys.forEach((key, index) => {
    const type = typeof initialFieldValues[index];
    initiallyCreateAllVariables += `\n${key} = ${
      type === 'string'
        ? `"${initialFieldValues[index]}"`
        : initialFieldValues[index]
    }${index === initialFieldKeys.length - 1 ? '\n\n' : ''}`;
  });
  return initiallyCreateAllVariables;
};

const mergeAndUpdateVariables = async ({ id, variables }) => {
  try {
    const keysToDelete = [];
    const mergeVideoKeys = Object.keys(variables?.videosToMerge);

    const mergedVideos = [
      ...(await Promise.all(
        mergeVideoKeys.map(async (key) => {
          try {
            return await mergeVideos({
              projectId: id,
              fieldName: key,
              filesToMerge: variables?.videosToMerge?.[key],
            });
          } catch (error) {
            throw new Error(error.message);
          }
        })
      )),
    ];

    console.info('All field videos have been merged successfully');

    keysToDelete.push(...mergedVideos.map((x) => x.url.split('.com/')[1]));

    mergeVideoKeys.forEach((key, index) => {
      variables[key] = mergedVideos[index].url;
      variables[`len_${key}`] = mergedVideos[index].endTime;
      variables[`start_${key}`] = mergedVideos[index].startTime;
    });

    return {
      variables,
      keysToDelete,
    };
  } catch (e) {
    console.error('Error: [mergeAndUpdateVariables]');
    throw new Error(e);
  }
};

const mergeVideos = async ({
  projectId,
  fieldName,
  filesToMerge,
  finalFileName = '',
  folder = 'input/working',
}) => {
  try {
    let mergedFileUrl;
    // There is a limit of 255 characters for file name, so the commented logic fails if we have several sub clips, Hence generating a random name
    // const fileNames =
    //   !finalFileName &&
    //   filesToMerge.map(({ name, startTime, endTime }) => `${name}-${startTime}-${endTime}`);
    const finalDuration = filesToMerge
      .map(({ duration }) => duration)
      .reduce((prev, next) => prev + next, 0);
    const randomName = randomUUID();
    // Merge the segments using Elastic Transcoder
    finalFileName = finalFileName
      ? `${finalFileName}.mp4`
      : `${randomName}_${moment().format('YYYYMMDD_HHmmss')}.mp4`;
    const finalFileKey = `project_${projectId}/${folder}/${finalFileName}`;
    const mergeParams = {
      PipelineId: process.env.AWS_PIPELINE_ID,
      Inputs: filesToMerge.map(({ s3Key, startTime, duration }) => ({
        Key: s3Key,
        FrameRate: 'auto',
        Resolution: 'auto',
        AspectRatio: 'auto',
        Interlaced: 'auto',
        Container: 'auto',
        ...(startTime &&
          duration && {
            TimeSpan: {
              StartTime: startTime.toString(),
              Duration: duration.toString(),
            },
          }),
      })),
      Output: {
        Key: finalFileKey,
        PresetId: process.env.AWS_PRESET_ID,
      },
    };

    try {
      const mergeResult = await transcoder.createJob(mergeParams).promise();

      console.log(`Job created to merge segments into final video`);

      let status = await checkJobStatus(mergeResult.Job.Id);
      console.log(`Job ${mergeResult.Job.Id} is ${status}.`);

      while (status !== 'Complete') {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds
        status = await checkJobStatus(mergeResult.Job.Id);
      }
      console.log(`Job ${mergeResult.Job.Id} is complete.`);

      const startTime = Date.now();
      while (Date.now() - startTime < 60 * 1000) {
        const fetchFile = async (Key) => {
          await s3
            .putObjectAcl({
              Key,
              ACL: 'public-read',
            })
            .promise();
          const fileUrl = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key,
          });

          return fileUrl?.split('?AWSAccessKeyId')?.[0];
        };
        try {
          mergedFileUrl = await fetchFile(finalFileKey);

          break;
        } catch (err) {
          console.log(
            `Error checking S3 files for ${fieldName}: ${err}. Retrying in 5 seconds.`
          );
          await new Promise((res) => setTimeout(res, 5000));
        }
      }

      return {
        name: finalFileName,
        url: mergedFileUrl,
        startTime: 0,
        endTime: finalDuration,
        s3Key: finalFileKey,
      };
    } catch (err) {
      console.error(err.message);
      throw new Error(err.message);
    }
  } catch (err) {
    console.error('Outer Error:', err.message);
    throw new Error(err.message);
  }
};

module.exports = {
  add,
  getAll,
  update,
  remove,
  getById,
  deleteFile,
  mergeFinalVideo,
  getTemplateFields,
  updateProjectName,
  downloadFinalVideo,
  renderTemplateVideo,
  updateProjectStatus,
  updateProcessingStatus,
  generateMergeBlockFields,
};
