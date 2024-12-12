const { Album } = require('../../../models/Album');
const Project = require('../../../models/Project');
const { AlbumShot } = require('../../../models/AlbumShot');
const { VideoProject } = require('../../../models/VideoProject');

exports.createVideoProjectAlbum = async ({
  videoProjectName,
  description = '',
  clientId,
  userName,
  userId,
}) => {
  try {
    const albumData = {
      clientId,
      createdByUser: userId,
      name: videoProjectName,
      description: `Created by ${userName} from Video project screen`,
    };
    const newAlbum = await Album.create({
      ...albumData,
    });
    const defaultAlbumShot = await AlbumShot.create({
      name: 'Default Scene',
      album: newAlbum._id,
      shotUrl: `DefaultScene-${newAlbum?._id?.toString()?.slice(-7)}`,
      isDefault: true,
    });
    newAlbum.albumshots.push(defaultAlbumShot?._id);
    await newAlbum.save();

    const projectVideo = {
      clientId,
      createdByUser: userId,
      name: videoProjectName,
      description,
      albumId: newAlbum?._id,
    };

    const newVideoProject = await VideoProject.create({
      ...projectVideo,
    });

    const projectData = {
      clientId,
      yourName: userName,
      albumId: newAlbum?._id,
      projectStatus: 'Opened',
      projectName: videoProjectName,
      videoProjectId: newVideoProject?._id,
    };

    const newProject = await Project.create({
      ...projectData,
    });

    newVideoProject.projectId = newProject?._id;
    newVideoProject.save();

    return {
      msg: 'Video Project Created successfully',
      newVideoProject,

      status: 200,
    };
  } catch (err) {
    console.error(err);
    return err.message;
  }
};
