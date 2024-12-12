const moment = require('moment');
const { Inventories } = require('../../models/Inventories');
const User = require('../../models/User');
const { VideoRequests } = require('../../models/VideoRequests');
const { sentEmail } = require('../../utils/emailByPostmark');
const { ObjectId } = require('../../utils/helper');
const {
  sendEmailToVideoRequest,
  ReminderEmailONVideoRequest,
} = require('./email services');

const addVideoRequests = async (req, res) => {
  try {
    const {
      videoRequestName,
      clientId,
      description,
      category,
      dueDate,
      assignTo,
      color,
      status,
      themeId,
      userId,
      schoolYear,
    } = req.body;
    let newStatus;

    if (userId === assignTo) {
      newStatus = 'in-progress';
    } else {
      newStatus = status;
    }

    const videoRequestData = {
      color,
      clientId,
      themeId,
      category,
      dueDate,
      assignTo,
      schoolYear,
      description,
      videoRequestName,
      userId: userId || '',
      ...req.body,
      status: newStatus,
    };

    const newVideoRequests = await VideoRequests.create({
      ...videoRequestData,
    });

    return res
      .status(200)
      .send({ msg: 'successfully Added', newVideoRequests });
  } catch (err) {
    return res.status(500).send({
      msg: err.message,
    });
  }
};

const getAllVideoRequests = async (req, res) => {
  try {
    const { clientId } = req.query;

    if (!clientId) {
      return res.status(400).json({ msg: 'School is missig' });
    }

    const allVideoRequests = await VideoRequests.find({
      clientId: ObjectId(clientId),
    })
      .populate('themeId', '-_v')
      .populate('userId', 'fullName username')
      .collation({ locale: 'en' })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    return res.status(200).json({ allVideoRequests });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const getVideoRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const videoRequestById = await VideoRequests.findById(id);
    if (!videoRequestById) {
      return res.status(404).json({ msg: 'No video request found!' });
    }
    return res.status(200).json(videoRequestById);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const updateVideoRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignTo, userId, schoolYear } = req.body;

    if (assignTo) {
      const videoRequestById =
        await VideoRequests.findById(id).populate('assignTo');

      if (assignTo !== videoRequestById.assignTo?._id.toString()) {
        const isUser = await User.findById(userId);
        const user = await User.findById(assignTo);

        const emailFormateResult = sendEmailToVideoRequest({
          assignToName: user?.username || user?.fullName,
          title: videoRequestById?.videoRequestName,
          year: videoRequestById?.schoolYear || schoolYear,
          email: user?.email,
          dueDate: videoRequestById?.dueDate
            ? moment(videoRequestById?.dueDate).format('YYYY-MM-DD')
            : '-',
          category: videoRequestById?.category,
          requestedBy: isUser?.username || isUser?.fullName,
          description: videoRequestById?.description,
        });

        const result = await sentEmail(emailFormateResult);
        if (result.success === false) {
          console.info(result.message);
        }
      }
    }

    const updatedVideoRequest = await VideoRequests.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    if (!updatedVideoRequest) {
      return res.status(404).json({ msg: 'Unable To Update' });
    }

    return res.status(200).json({
      msg: ' Video Request updated successfully!',
      updatedVideoRequest,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

const deleteVideoRequest = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ msg: 'Id is missig' });
    }
    const deletedVideoRequest = await VideoRequests.findByIdAndDelete(id);
    if (!deletedVideoRequest) {
      return res.status(404).send({ msg: 'Video Request not found' });
    }

    return res.status(200).json({ msg: 'Video request Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const addMulipleVideoRequest = async (req, res) => {
  const { invontriesIds, clientId, userId } = req.body;
  try {
    const getInventories = await Inventories.find({
      _id: { $in: invontriesIds },
    });
    if (getInventories.length <= 0) {
      return res.status(404).send({ msg: 'Inventories not found' });
    }

    const addData = getInventories?.map((data) => {
      return {
        clientId,
        userId: userId || '',
        category: data.category,
        videoRequestName: data.name,
        description: data.description,
      };
    });

    const newVideoRequests = await VideoRequests.create(addData);

    return res
      .status(200)
      .json({ msg: 'Video request add Successfully', newVideoRequests });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const sendEmailToUserOnVideoRequest = async (req, res) => {
  const { id, assignTo, schoolYear } = req.body;

  try {
    const getVideoRequestById =
      await VideoRequests.findById(id).populate('userId');
    if (!getVideoRequestById) {
      return res.status(404).send({ msg: 'Video Requests not found' });
    }

    const user = await User.findById(assignTo);

    let result;

    if (user?._id != getVideoRequestById?.userId?._id) {
      const emailFormateResult = sendEmailToVideoRequest({
        assignToName: user?.username || user?.fullName,
        title: getVideoRequestById?.videoRequestName,
        email: user?.email,
        dueDate: getVideoRequestById?.dueDate
          ? moment(getVideoRequestById?.dueDate).format('YYYY-MM-DD')
          : '-',
        category: getVideoRequestById?.category,
        requestedBy:
          getVideoRequestById?.userId?.username ||
          getVideoRequestById?.userId?.fullName,
        description: getVideoRequestById?.description,
        year: getVideoRequestById?.schoolYear || schoolYear,
      });

      result = await sentEmail(emailFormateResult);
    }
    let status;
    if (user?._id === getVideoRequestById?.userId?._id) {
      status = 'in-progress';
    } else {
      status = 'pending';
    }
    const updatedLibrary = await VideoRequests.findByIdAndUpdate(
      id,
      { assignTo, status },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: 'Video request add Successfully', result, updatedLibrary });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const sendEmailToUser = async (req, res) => {
  const { id, assignTo, schoolYear } = req.body;

  try {
    const getVideoRequestById =
      await VideoRequests.findById(id).populate('userId');
    if (!getVideoRequestById) {
      return res.status(404).send({ msg: 'Video Requests not found' });
    }

    const user = await User.findById(assignTo);

    let result;

    if (user?._id != getVideoRequestById?.userId?._id) {
      const emailFormateResult = sendEmailToVideoRequest({
        assignToName: user?.username || user?.fullName,
        title: getVideoRequestById?.videoRequestName,
        email: user?.email,
        dueDate: getVideoRequestById?.dueDate
          ? moment(getVideoRequestById?.dueDate).format('YYYY-MM-DD')
          : '-',
        category: getVideoRequestById?.category,
        requestedBy:
          getVideoRequestById?.userId?.username ||
          getVideoRequestById?.userId?.fullName,
        description: getVideoRequestById?.description,
        year: getVideoRequestById?.schoolYear || schoolYear,
      });

      result = await sentEmail(emailFormateResult);
    }

    return res
      .status(200)
      .json({ msg: 'Video request add Successfully', result });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const sendReminderEmail = async (req, res) => {
  const { sendEmail, requestedById } = req.body;
  try {
    if (!sendEmail) {
      return res.status(404).send({ msg: 'user Id is missing' });
    }
    const requestedBy = await User.findById(requestedById, 'username');

    const emailResults = await Promise.all(
      sendEmail?.map(async ({ videoRequestId, assignTo }) => {
        const getVideoRequestById = await VideoRequests.findOne({
          _id: videoRequestId,
          assignTo: assignTo,
        })
          .populate('userId', 'fullName username email')
          .populate('assignTo', 'fullName username email');

        if (!getVideoRequestById) {
          throw new Error(`Video Request with ID ${videoRequestId} not found`);
        }
        let emailFormatResult;
        if (getVideoRequestById?.status != 'pending') {
          emailFormatResult = ReminderEmailONVideoRequest({
            assignToName:
              getVideoRequestById?.assignTo?.username ||
              getVideoRequestById?.assignTo?.fullName,
            title: getVideoRequestById?.videoRequestName,
            email: getVideoRequestById?.assignTo?.email,
            category: getVideoRequestById?.category,
            requestedBy:
              requestedBy?.username || getVideoRequestById?.userId?.username,
            year: getVideoRequestById?.schoolYear,
            dueDate: getVideoRequestById?.dueDate
              ? moment(getVideoRequestById?.dueDate).format('YYYY-MM-DD')
              : '-',
          });
        } else {
          emailFormatResult = sendEmailToVideoRequest({
            assignToName:
              getVideoRequestById?.assignTo?.username ||
              getVideoRequestById?.assignTo?.fullName,
            title: getVideoRequestById?.videoRequestName,
            email: getVideoRequestById?.assignTo?.email,
            dueDate: getVideoRequestById?.dueDate
              ? moment(getVideoRequestById?.dueDate).format('YYYY-MM-DD')
              : '-',
            category: getVideoRequestById?.category,
            requestedBy:
              requestedBy?.username || getVideoRequestById?.userId?.username,
            description: getVideoRequestById?.description,
            year: getVideoRequestById?.schoolYear,
          });
        }

        const result = await sentEmail(emailFormatResult);

        return { videoRequestId, result };
      })
    );

    return res
      .status(200)
      .json({ msg: 'Emails sent successfully', results: emailResults });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const getAllVideoRequestsByAssignId = async (req, res) => {
  try {
    const id = req.params.id;
    const { assignTo, schoolYear, searchParamsValue } = req.query;

    if (!id) {
      return res.status(400).json({ msg: 'School is missig' });
    }
    const query = {
      clientId: ObjectId(id),
      assignTo: ObjectId(assignTo),
      $or: [
        { videoRequestName: new RegExp(searchParamsValue, 'i') },
        { description: new RegExp(searchParamsValue, 'i') },
      ],
    };

    if (schoolYear) {
      query.schoolYear = schoolYear;
    }

    const allVideoRequests = await VideoRequests.find(query)
      .populate('userId', 'fullName username')
      .collation({ locale: 'en' })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();
    return res.status(200).json({ allVideoRequests });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  sendEmailToUser,
  addVideoRequests,
  sendReminderEmail,
  updateVideoRequest,
  deleteVideoRequest,
  getAllVideoRequests,
  getVideoRequestById,
  addMulipleVideoRequest,
  getAllVideoRequestsByAssignId,
  sendEmailToUserOnVideoRequest,
};
