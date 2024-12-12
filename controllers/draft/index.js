const VideoDraft = require('../../models/Draft');
const { ObjectId } = require('../../utils/helper');

require('dotenv').config();

const addVideoDraft = async (req, res) => {
  try {
    const data = req.body;

    let draftVideo = await VideoDraft.findOne({
      videoProjectId: data?.videoProjectId,
    });

    const videoDraftReq = {
      videoProjectId: data?.videoProjectId,
      clientId: data?.clientId,
      draftVideo: { ...data?.item, createdAt: new Date() },
    };

    if (draftVideo) {
      draftVideo.draftVideo.push(videoDraftReq.draftVideo);
      await draftVideo.save();
    } else {
      draftVideo = new VideoDraft(videoDraftReq);
      await draftVideo.save();
    }
    return res.status(200).send({
      msg: 'Successfully Added Video to Draft',
      videoDraft: draftVideo,
      status: 200,
    });
  } catch (err) {
    return res.status(500).send({
      msg: err.message,
      status: 500,
    });
  }
};

const addComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, videoProjectId, comments, userData, userId } = req.query;
    if (!clientId) {
      return res.status(400).json({
        msg: ' clientId is required.',
        status: 400,
      });
    } else if (!videoProjectId) {
      return res.status(400).json({
        msg: 'videoProjectId is required.',
        status: 400,
      });
    }

    let draftVideo = await VideoDraft.findOne({ _id: id });
    if (!draftVideo || draftVideo.length === 0) {
      return res
        .status(404)
        .json({ msg: 'No Draft found for the provided IDs.', status: 404 });
    }
    draftVideo.comments.push({
      userId: userId || userData.userId,
      createdAt: new Date(),
      comment: comments,
    });
    draftVideo = await draftVideo.save();
    const dataAddComment = await draftVideo.populate('comments.userId');
    return res.status(200).json({ draftVideo: dataAddComment, status: 200 });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: `${err?.message} Internal server error`, status: 500 });
  }
};

const getVideoDraftByClientId = async (req, res) => {
  try {
    const { clientId, videoProjectId } = req.query;
    if (!clientId) {
      return res.status(400).json({
        msg: ' clientId is required.',
        status: 400,
      });
    } else if (!videoProjectId) {
      return res.status(400).json({
        msg: 'videoProjectId is required.',
        status: 400,
      });
    }

    const getDraftVideo = await VideoDraft.find({
      clientId: ObjectId(clientId),
      videoProjectId: ObjectId(videoProjectId),
    })
      .populate('comments.userId')
      .sort({ createdAt: -1 });

    if (!getDraftVideo || getDraftVideo.length === 0) {
      return res.status(404).json({ msg: 'No Draft found ', status: 404 });
    }
    const sortedDraftVideo = getDraftVideo.map((draft) => {
      const sortedComments = draft.draftVideo.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return { ...draft._doc, draftVideo: sortedComments };
    });

    return res
      .status(200)
      .json({ getDraftVideo: sortedDraftVideo, status: 200 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error', status: 500 });
  }
};

const renameDraftVideoName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mediaId } = req.body;
    const draftVideId = mediaId;
    if (!draftVideId) {
      return res.status(400).json({
        msg: 'draftVideId is required.',
        status: 400,
      });
    }

    const getDraftVideo = await VideoDraft.findOne({
      _id: ObjectId(id),
    });
    if (!getDraftVideo || getDraftVideo.length === 0) {
      return res.status(404).json({ msg: 'No Draft found', status: 404 });
    }

    const index = getDraftVideo?.draftVideo?.findIndex(
      (draftVideo) => draftVideo?._id.toString() === draftVideId
    );

    if (index === -1) {
      return res
        .status(404)
        .json({ msg: 'Draft video not found', status: 404 });
    }
    getDraftVideo.draftVideo[index].name = name;

    await getDraftVideo.save();

    return res.status(200).json({ getDraftVideo, status: 200 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error', status: 500 });
  }
};

module.exports = {
  addComments,
  addVideoDraft,
  renameDraftVideoName,
  getVideoDraftByClientId,
};
