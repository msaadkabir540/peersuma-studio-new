const { default: mongoose } = require('mongoose');
const { Album } = require('../../models/Album');
const { AlbumShot } = require('../../models/AlbumShot');
const Project = require('../../models/Project');
const User = require('../../models/User');
const { VideoProject } = require('../../models/VideoProject');
const { sentEmail } = require('../../utils/emailByPostmark');
const { ObjectId } = require('../../utils/helper');
const { getUniqueProjectName } = require('../utils');

const jwt = require('jsonwebtoken');
const config = require('../../config/auth');

const {
  sendEmailOnStatusChange,
  sendStatusChangeSMS,
  sendInviteShotSMS,
  sendInviteEmail,
} = require('./send-email');

exports.addVideoProject = async (req, res) => {
  try {
    const { description, clientId, userName, userId } = req.body;
    const videoProjectName = await getUniqueProjectName({
      clientId,
    });

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
      projectId: '',
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

    let newProject;

    newProject = await Project.create({
      ...projectData,
    });

    if (newProject && newProject._id) {
      newVideoProject.projectId = newProject._id;
      await newVideoProject.save();
    }

    return res.status(200).json({
      msg: 'Video Project Created successfully',
      newVideoProject,
      newProject,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

exports.getAllVideoProject = async (req, res) => {
  try {
    const {
      search,
      sortBy = '',
      sortOrder = '',
      status,
      // statusValue,
    } = req.query;
    const sortObject = {
      ...(sortBy
        ? { [sortBy]: sortOrder === 'asc' ? -1 : 1 }
        : { createdAt: 1 }),
    };

    const allVideoProject = await VideoProject.find({
      ...(search && { name: new RegExp(search, 'i') }),
      ...(status && { status: { $in: status } }),
    })
      .collation({ locale: 'en' })
      .sort(sortObject)
      .lean();

    return res.status(200).json({ allVideoProject });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.getVideoProjectById = async (req, res) => {
  try {
    const { id, shortLink } = req.params;
    const { sortBy = '', sortOrder = '' } = req.query;

    const sortObject = {
      ...(sortBy
        ? { [sortBy]: sortOrder === 'asc' ? -1 : 1 }
        : { createdAt: 1 }),
    };
    const videoProjectById = await VideoProject.findOne({
      ...(id && { _id: ObjectId(id) }),
      ...(shortLink && { shortLink }),
    })
      .populate('contributor.userId', 'username fullName')
      .populate('createdByUser', 'username fullName')
      .populate({
        path: 'albumId',
        select: '-__v',
        populate: {
          path: 'albumshots',
          select: '-__v',
          populate: {
            path: 'media.userId',
            select: 'username fullName _id', // Optionally select the fields you want to include/exclude from userId
          },
        },
      })
      .sort(sortObject);
    if (!videoProjectById) {
      return res.status(404).json({ msg: 'No Video Project found!' });
    }

    return res.status(200).json({ videoProjectById, status: 200 });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message, status: 400 });
  }
};

exports.getVideoProjectByClientId = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sortBy = '',
      sortOrder = '',
      userId,
      status,
      search,
      isFilter,
      roles,
    } = req.query;
    const sortObject = sortBy
      ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      : { updatedAt: -1 };

    const allVideoProject = await VideoProject.find({
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
      ...(id && { clientId: ObjectId(id) }),
      ...(roles != 'backend' && {
        $or: [
          { createdByUser: ObjectId(userId) },
          { 'contributor.userId': ObjectId(userId) },
        ],
      }),
      ...(status && { status: { $in: status } }),
      ...(search && { name: new RegExp(search, 'i') }),
    })
      .populate({
        path: 'albumId',
        model: 'album',
        select: 'albumshots _id',
        populate: {
          path: 'albumshots',
          model: 'albumshot',
        },
      })
      .populate({
        path: 'contributor.videoProjectId',
        model: 'video-project',
      })
      .populate({
        path: 'contributor.userId',
        model: 'user',
      })
      .populate({
        path: 'createdByUser',
        model: 'user',
        select: 'username _id',
      })
      .collation({ locale: 'en' })
      .sort(sortObject);

    let mergedVideoProjects;
    if (
      isFilter === 'all-Projects' ||
      isFilter === null ||
      isFilter === undefined
    ) {
      mergedVideoProjects = allVideoProject;
    } else if (isFilter === 'my-projects') {
      mergedVideoProjects = allVideoProject.filter((project) => {
        return project?.createdByUser?._id?.toString() === userId?.toString();
      });
    } else if (isFilter === 'shared-projects') {
      mergedVideoProjects = allVideoProject.filter((project) =>
        project.contributor?.some(
          (contributor) =>
            contributor?.userId?._id?.toString() === userId?.toString()
        )
      );
    }

    return res.status(200).json({
      count: mergedVideoProjects.length,
      allVideoProject: mergedVideoProjects,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message, status: 400 });
  }
};

exports.updateVideoProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, dueDate } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (dueDate) updatedFields.dueDate = dueDate;
    if (description) updatedFields.description = description;
    const UpdateName = {};
    if (name) UpdateName.name = name;

    const updateData = await VideoProject.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updateData) {
      return res.status(404).json({ msg: 'No Video Project found!' });
    }
    // Update projectName in Project collection
    const project = await Project.findByIdAndUpdate(
      updateData.projectId,
      { $set: { projectName: name } },
      { new: true, runValidators: true }
    );
    if (!project) {
      throw new Error('No  Project found!');
    }
    // Update name in Album collection
    const album = await Album.findByIdAndUpdate(
      updateData.albumId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!album) {
      throw new Error('No  Project found!');
    }

    return res.status(200).json({
      msg: 'Video Project updated successfully',
      updateData,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

exports.updateVideoProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, oldStatus, statusChangeFrom, videoProjectOwnerId } =
      req.body;

    const updatedFields = {};
    if (status) updatedFields.status = status;

    const updateData = await VideoProject.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    const user = await User.findOne({ _id: ObjectId(videoProjectOwnerId) });

    if (!updateData) {
      return res.status(404).json({ msg: 'No Video Project found!' });
    }

    if (statusChangeFrom === 'projectsPeersuma') {
      const sendToAlan = sendEmailOnStatusChange({
        Name: 'Alan',
        videoProjectName: name,
        oldStatus: oldStatus,
        newStatus: status,
        email: process.env.ALAN_EMAIL_ADDRESS,
        id,
      });
      await sentEmail(sendToAlan);
    } else if (statusChangeFrom === 'peersumaStudio') {
      const sendToUser = sendEmailOnStatusChange({
        videoProjectName: name,
        oldStatus: oldStatus,
        newStatus: status,
        email: user?.email,
        Name: user?.username,
        id,
      });
      await sentEmail(sendToUser);
      if (user?.isAllowContact)
        await sendStatusChangeSMS({
          newStatus: status,
          oldStatus: oldStatus,
          contactNumber: user?.contactNumber,
          videoProjectId: id,
          videoProjectName: name,
        });
    }
    return res.status(200).json({
      msg: 'Video Project status updated successfully',
      updateData,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const {
      shotId,
      emailNote,
      sendByUser,
      clientName,
      sendShotName,
      videoProjectId,
      sendShotToUser,
      selectedClient,
      videoProjectName,
      sendShotToUserId,
    } = req.body;

    if (!mongoose.isValidObjectId(shotId)) {
      return res.status(400).json({ error: 'Invalid albumshot ID!' });
    }

    const albumShot = await AlbumShot.findById(shotId);
    if (!albumShot) {
      return res.status(400).send({ error: "Album shot doesn't exist" });
    }

    let shotLink = `${process.env.VIDEO_PROJECT_URL}upload/${albumShot.shotUrl}`;
    let user = null;

    if (sendShotToUserId) {
      user = await User.findOne({
        $or: [
          { _id: sendShotToUserId },
          { email: sendShotToUser },
          { contactNumber: sendShotToUser },
        ],
      });
      if (user) {
        let clientExists = user.clientId.some(
          (client) => client.clientId.toString() === selectedClient
        );
        if (!clientExists) {
          user.clientId.push({
            clientId: selectedClient,
            role: 'crew producer',
          });
          await user.save();
        }
      }

      const videoProject = await VideoProject.findById(videoProjectId);
      if (!videoProject) {
        return res.status(400).json({ error: 'Video project not found' });
      }

      const checkContributorExist = videoProject.contributor?.some((data) => {
        if (
          !data?.userId ||
          !data?.albumShotId ||
          !user?._id ||
          !albumShot?._id
        ) {
          return false;
        }

        const isUserIdMatch = data.userId.toString() === user._id.toString();
        const isAlbumShotIdMatch =
          data.albumShotId.toString() === albumShot._id.toString();
        return isUserIdMatch && isAlbumShotIdMatch;
      });

      if (!checkContributorExist) {
        videoProject.contributor = videoProject?.contributor || [];
        videoProject?.contributor?.push({
          userId: user?._id,
          videoProjectId: videoProject?._id,
          albumShotId: albumShot?._id,
        });
        await videoProject.save();
      }

      albumShot.invites = albumShot.invites || [];
      albumShot?.invites?.push({ id: user._id, lastInvited: new Date() });
      await albumShot.save();

      const contributor = videoProject.contributor.map((contributor) =>
        contributor.videoProjectId.toString()
      );
      const tokenData = {
        userId: user?._id,
        videoProjectId,
        clientId: user?.clientId,
        roles: user?.roles,
        selectedClientId: selectedClient,
        contributor,
      };
      const token = jwt.sign(tokenData, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
      });
      shotLink = `${
        process.env.VIDEO_PROJECT_URL
      }/authentication?accessToken=${encodeURIComponent(token)}`;
    }
    //
    const inviteDetails = {
      shotLink,
      emailNote,
      clientName,
      sendByUser,
      videoProjectName,
      email: user?.email || sendShotToUser,
      shotName: albumShot.name || sendShotName,
      userName: user?.username || user?.fullName || 'Guest',
      signUpLink: `${process.env.VIDEO_PROJECT_URL}/login?school=${selectedClient}`,
    };

    await sentEmail(sendInviteEmail(inviteDetails));

    if (user?.isAllowContact) {
      await sendInviteShotSMS({
        shotLink,
        userId: user?._id,
        clientName,
        shotName: sendShotName,
        shotUploadLink: shotLink,
        contactNumber: user?.contactNumber,
      });
    }

    return res
      .status(200)
      .json({ msg: 'Your invitation is successfully sent.', status: 200 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.temporaryDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDeleted } = req.body;

    const findByIdVideoProject = await VideoProject.findById(id);

    await VideoProject.updateOne({ _id: id }, { isDeleted: isDeleted });

    await Album.updateOne(
      { _id: ObjectId(findByIdVideoProject?.albumId) },
      { isDeleted: isDeleted }
    );

    await Project.updateOne(
      {
        videoProjectId: ObjectId(id),
      },
      { isDeleted: isDeleted }
    );

    return res.status(200).json({
      msg: 'Successfully Deleted.',
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
