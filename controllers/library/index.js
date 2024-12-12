// Importing required modules and helper functions
const Widget = require('../../models/Widget');
const LibraryMedia = require('../../models/LibraryMedia');

const { Vimeo } = require('../../utils/vimeo');
const { ObjectId, callWithTimeout } = require('../../utils/helper');
const { handleUpdateThumbnailReplace } = require('./helper');

// Function to create a new library media
const add = async (req, res) => {
  try {
    const { videoUrl, folderId, uploads, userId, videoURL, clientId } =
      req.body;

    if (!videoUrl?.split('.com/')?.[1]) {
      return res.status(404).json({ msg: 'Invalid video url!' });
    }

    const isAvailable = await Vimeo.isVideoAvailable({ id: videoURL });

    let newLibraryMedia;
    if (isAvailable) {
      const {
        link,
        duration,
        base_link,
        downloads,
        modified_time,
        player_embed_url,
      } = await Vimeo.getSingleVideoData({
        assetId: videoUrl?.split('.com/')?.[1],
      });
      newLibraryMedia = await LibraryMedia.create({
        ...req.body,
        duration,
        downloads,
        videoUrl: link,
        isUpdate: false,
        thumbnailUrl: base_link,
        widgetUrl: player_embed_url,
        currentModifyDate: modified_time,
        assetId: videoUrl?.split('.com/')?.[1],
        shortLink: Math.random().toString(36).substring(2, 10),
      });
      if (!newLibraryMedia) {
        return res.status(404).json({ msg: 'Unable to add Library Media!' });
      }

      return res.status(200).json({
        msg: 'Library Media added successfully',
        newLibraryMedia,
      });
    } else {
      await Promise.all(
        uploads?.map(
          async ({ id }) =>
            await Vimeo.moveVideoToAFolder({ folderId, videoId: id })
        )
      );
      let videosRes = await Promise.all(
        uploads?.map(async (upload) => await Vimeo.getVideo(upload))
      );

      await Promise.all(
        uploads?.map(async (upload) => {
          await Vimeo.setUnlistedVimeoVideo({
            id: upload?.id,
          });
        })
      );

      const videos = videosRes.map(
        ({
          name,
          duration,
          link,
          downloads,
          modified_time,
          pictures: { base_link },
          uri,
        }) => ({
          name,
          duration,
          userId,
          clientId,
          downloads,
          active: true,
          videoUrl: link,
          shareable: true,
          thumbnailUrl: base_link,
          assetId: uri?.split('/').pop(),
          currentModifyDate: modified_time,
          shortLink: Math.random().toString(36).substring(2, 10),
        })
      );

      const newLibraryMedia = await LibraryMedia.insertMany(videos);
      if (!newLibraryMedia) {
        return res.status(404).json({ msg: 'Unable to update Library Media!' });
      }

      res.status(200).send({
        msg: 'Library Media added successfully',
        newLibraryMedia,
        videosRes,
      });

      await Promise.all(
        uploads.map(
          async (upload) =>
            await callWithTimeout({
              params: upload,
              interval: 10 * 1000,
              fn: Vimeo.isVideoAvailable,
            })
        )
      );
      await Promise.all(
        uploads.map(async (upload) => await Vimeo.createThumbnail(upload))
      );

      let updatedVideosRes = await Promise.all(
        uploads.map(async (upload) => await Vimeo.getVideo(upload))
      );

      const bulkUpdateOps = updatedVideosRes.map(
        ({
          name,
          duration,
          link,
          uri,
          downloads,
          pictures: { base_link },
          player_embed_url,
          modified_time,
        }) => ({
          updateOne: {
            filter: { assetId: uri.split('/').pop() },
            update: {
              $set: {
                name,
                duration,
                downloads,
                videoUrl: link,
                thumbnailUrl: base_link,
                widgetUrl: player_embed_url,
                currentModifyDate: modified_time,
              },
            },
          },
        })
      );

      const updatedLibraryMedia = await LibraryMedia.bulkWrite(bulkUpdateOps);
      if (!updatedLibraryMedia) {
        console.error({ msg: 'Unable to update Library Media!' });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Function to add multiple library media
const addMany = async (req, res) => {
  try {
    const { clientId, uploads, folderId, userId } = req.body;
    await Promise.all(
      uploads?.map(
        async ({ id }) =>
          await Vimeo.moveVideoToAFolder({ folderId, videoId: id })
      )
    );
    let videosRes = await Promise.all(
      uploads?.map(async (upload) => await Vimeo.getVideo(upload))
    );

    await Promise.all(
      uploads?.map(async (upload) => {
        await Vimeo.setUnlistedVimeoVideo({
          id: upload?.id,
        });
      })
    );

    const videos = videosRes.map(
      ({
        name,
        duration,
        link,
        downloads,
        pictures: { base_link },
        modified_time,
      }) => ({
        name,
        duration,
        userId,
        clientId,
        downloads,
        active: true,
        isUpdate: true,
        videoUrl: link,
        shareable: true,
        thumbnailUrl: base_link,
        currentModifyDate: modified_time,
        assetId: link?.split('/').pop(),
        shortLink:
          link?.split('/').pop() + Math.random().toString(36).substring(2, 5),
      })
    );

    const newLibraryMedia = await LibraryMedia.insertMany(videos);

    if (!newLibraryMedia) {
      return res.status(404).json({ msg: 'Unable to update Library Media!' });
    }

    res.status(200).send({
      msg: 'Library Media added successfully',
      newLibraryMedia,
      videosRes,
    });

    await Promise.all(
      uploads.map(
        async (upload) =>
          await callWithTimeout({
            params: upload,
            interval: 10 * 1000,
            fn: Vimeo.isVideoAvailable,
          })
      )
    );
    await Promise.all(
      uploads.map(async (upload) => await Vimeo.createThumbnail(upload))
    );

    let updatedVideosRes = await Promise.all(
      uploads.map(async (upload) => await Vimeo.getVideo(upload))
    );

    const bulkUpdateOps = updatedVideosRes.map(
      ({
        name,
        duration,
        link,
        uri,
        downloads,
        pictures: { base_link },
        player_embed_url,
        modified_time,
      }) => ({
        updateOne: {
          filter: { assetId: uri.split('/').pop() },
          update: {
            $set: {
              name,
              duration,
              downloads,
              videoUrl: link,
              isUpdate: false,
              thumbnailUrl: base_link,
              widgetUrl: player_embed_url,
              currentModifyDate: modified_time,
            },
          },
        },
      })
    );

    const updatedLibraryMedia = await LibraryMedia.bulkWrite(bulkUpdateOps);
    if (!updatedLibraryMedia) {
      console.error({ msg: 'Unable to update Library Media!' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Function to update a library media
const update = async (req, res) => {
  try {
    const data = req.body;
    const splitVideoUrl = data?.videoUrl?.split('/');
    let newAssetId;
    if (splitVideoUrl.length > 4) {
      newAssetId = splitVideoUrl?.[splitVideoUrl?.length - 2];
    } else {
      newAssetId = splitVideoUrl?.pop();
    }

    const oldMedia = await LibraryMedia.findById(req.params.id);
    if (!oldMedia) {
      return res.status(404).json({ msg: 'Library Media not found!' });
    }

    if (newAssetId !== oldMedia?.assetId) {
      const isViemo = await Vimeo.getSingleVideoData({
        assetId: newAssetId,
      });
      data.isUpdate = false;
      data.assetId = newAssetId;
      data.videoUrl = isViemo?.link;
      data.duration = isViemo?.duration;
      data.duration = isViemo?.duration;
      data.downloads = isViemo?.downloads;
      data.thumbnailUrl = isViemo?.base_link;
      data.widgetUrl = isViemo?.player_embed_url;
      data.currentModifyDate = isViemo?.modify_date;
    }

    const newLibraryMedia = await LibraryMedia.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true }
    );

    await LibraryMedia.updateMany(
      { assetId: newAssetId },
      {
        $set: {
          currentModifyDate: data?.modify_date,
        },
      }
    );

    if (!newLibraryMedia) {
      return res.status(404).json({ msg: 'Unable to update Library Media!' });
    }

    return res
      .status(200)
      .json({ msg: 'Library Media updated successfully.', newLibraryMedia });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Function to get all library media

const getAll = async (req, res) => {
  try {
    const {
      search,
      active,
      sortBy = 'createdAt',
      clientId,
      sortOrder = 'desc',
      selectedWidgetId,
    } = req.query;

    if (!clientId) {
      return res.status(400).json({ msg: 'Client Id is required' });
    }

    const sortObject = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const libraryFilter = {
      clientId: ObjectId(clientId),
      ...(selectedWidgetId && { _id: { $nin: [] } }),
      ...(search && { name: new RegExp(search, 'i') }),
      ...(active && { active: active === 'true' }),
    };

    const promises = [
      // await handleUpdateThumbnailReplace({ clientId }),
      Widget.find(
        { clientId: ObjectId(clientId), active: true },
        { name: 1 }
      ).lean(),

      selectedWidgetId
        ? Widget.findOne(
            {
              _id: ObjectId(selectedWidgetId),
              clientId: ObjectId(clientId),
              active: true,
            },
            { media: 1 }
          )
            .populate('media._id')
            .lean()
        : Promise.resolve(null),

      LibraryMedia.find(libraryFilter).sort(sortObject).lean(),
    ];
    // updateThumbnail;
    const [allWidgets, selectedWidget, allLibraries] =
      await Promise.all(promises);
    const formattedWidgets = allWidgets?.map(({ _id: value, name: label }) => ({
      label,
      value,
    }));

    const selectedWidgetMedia = selectedWidget?.media?.map((x) => x?._id) || [];
    if (selectedWidgetMedia?.length) {
      libraryFilter._id = { $nin: selectedWidgetMedia };
    }

    return res.status(200).json({
      librariesCount: allLibraries.length,
      allWidgets: formattedWidgets,
      allLibraries,
      selectedWidget,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

// Function to get a library media by id
const getById = async (req, res) => {
  try {
    const { id, shortLink } = req.query;
    const libraryMedia = await LibraryMedia.findOne({
      ...(id && { _id: ObjectId(id) }),
      ...(shortLink && { shortLink }),
    }).lean();
    if (!libraryMedia) {
      return res.status(404).json({ msg: 'No Library Media found!' });
    }

    return res.status(200).json(libraryMedia);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

// Function to delete a library media
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.body;
    const findAllWidgets = await Widget.find(
      {
        clientId: ObjectId(clientId),
        active: true,
      },
      'media'
    );
    if (findAllWidgets.length > 0) {
      for (const widget of findAllWidgets) {
        widget.media = widget?.media?.filter(
          (mediaItem) => mediaItem?._id?.toString() !== id
        );

        await widget.save();
      }
    }

    const deleteLibraryMedia = await LibraryMedia.findByIdAndDelete(
      req.params.id
    );

    if (!deleteLibraryMedia) {
      return res.status(404).send({ msg: 'Library Media not found!' });
    }

    return res.status(200).json({ msg: 'Library Media deleted Successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

// Function to update short link of a library media
const updateShortLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { shortLink } = req.body;

    const shortLinkExists = await LibraryMedia.findOne({
      _id: { $ne: ObjectId(id) },
      shortLink,
    });
    if (shortLinkExists) {
      return res.status(422).send({ msg: 'Short link already exists!' });
    }

    const updatedLibrary = await LibraryMedia.findByIdAndUpdate(
      id,
      { shortLink },
      { new: true }
    );
    if (!updatedLibrary) {
      return res.status(404).send({ msg: 'Library Media not found!' });
    }

    return res
      .status(200)
      .json({ msg: 'Short link updated successfully', updatedLibrary });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

// Function to update vimeo video thumbnail from frame
const updateThumbnailFromFrame = async (req, res) => {
  try {
    const { id, assetId, time } = req.body;
    let thumbnail;
    let isVideo;
    if (time != null || time != undefined) {
      thumbnail = await Vimeo.createThumbnail({ id: assetId, time });
    } else {
      isVideo = await Vimeo.getVideo({ id: assetId });
      if (isVideo && isVideo.pictures && isVideo.pictures.base_link) {
        thumbnail = isVideo?.pictures?.base_link;
      }
    }
    if (!thumbnail) {
      return res.status(304).send({ msg: 'Unable to update video thumbnail!' });
    }

    if (!isVideo) {
      isVideo = await Vimeo.getVideo({ id: assetId });
    }

    const thumbnailUrl = isVideo?.pictures?.base_link || thumbnail?.thumbnail;
    const duration = isVideo?.duration || time;
    const currentModifyDate = isVideo?.modified_time;

    const updatedLibrary = await LibraryMedia.findByIdAndUpdate(
      id,
      { thumbnailUrl, duration, currentModifyDate },
      { new: true }
    );
    await LibraryMedia.updateMany(
      { assetId: assetId },
      {
        $set: {
          duration,
          currentModifyDate,
        },
      }
    );
    if (!updatedLibrary) {
      return res.status(304).send({ msg: 'Unable to update video thumbnail!' });
    }

    return res
      .status(200)
      .json({ msg: 'Thumbnail updated successfully', updatedLibrary });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

// Function to create a new library media
const getSingleViemoVideo = async (req, res) => {
  try {
    const { assetId } = req.query;
    let viemoVideo = await Vimeo.getVideo({
      id: assetId,
    });

    if (viemoVideo?.privacy?.view != 'unlisted') {
      await Vimeo.setUnlistedVimeoVideo({
        id: assetId,
      });
      viemoVideo = await Vimeo.getVideo({
        id: assetId,
      });
    }
    if (!viemoVideo) {
      return res.status(404).json({ msg: 'Unable to get Viemo Video!' });
    }

    return res.status(200).json({ msg: 'get viemo video', viemoVideo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};
// Function to create a new library media
const downloadLibraryVideo = async (req, res) => {
  try {
    const { id } = req.query;
    const libraryData = await LibraryMedia.findById(id);

    let viemoVideo = await Vimeo.getVideo({
      id: libraryData?.assetId,
    });

    if (viemoVideo?.privacy?.view != 'unlisted') {
      await Vimeo.setUnlistedVimeoVideo({
        id: assetId,
      });
      viemoVideo = await Vimeo.getVideo({
        id: assetId,
      });
    }
    if (!viemoVideo) {
      return res.status(404).json({ msg: 'Unable to get Viemo Video!' });
    }
    const viemoData = {
      download: viemoVideo?.download,
      libraryName: libraryData?.name,
    };

    return res.status(200).json({ msg: 'success.', viemoVideo: viemoData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Function to create a new library media
const checkAndUpdateReplaceVideo = async (req, res) => {
  try {
    const { assetId, libraryId } = req.query;
    let data = {};

    if (!assetId) {
      return res.status(404).json({ msg: 'viemo Id is missing!' });
    }
    const libraryUpdate = await LibraryMedia.findByIdAndUpdate(
      libraryId,
      { $set: { isUpdate: true } },
      { new: true }
    );
    const isViemo = await Vimeo.getSingleVideoData({
      assetId: assetId,
    });
    if (isViemo) {
      data.isUpdate = false;
      data.assetId = assetId;
      data.videoUrl = isViemo?.link;
      data.duration = isViemo?.duration;
      data.downloads = isViemo?.downloads;
      data.thumbnailUrl = isViemo?.base_link;
      data.widgetUrl = isViemo?.player_embed_url;
      data.currentModifyDate = isViemo?.modified_time;
    }
    if (
      assetId != libraryUpdate?.assetId &&
      libraryUpdate?.isUpdate &&
      libraryUpdate?.clientId != process.env.DEMO_SCHOOL_ID
    ) {
      const mediaPresent = await LibraryMedia.find({ assetId: assetId });
      if (mediaPresent.length <= 1) {
        await Vimeo.deleteVimeoVideo({
          id: libraryUpdate?.assetId,
        });
        await Vimeo.updateVimeoVideoName({
          id: assetId,
          newName: libraryUpdate?.name,
        });
      }
    }

    const newLibraryMedia = await LibraryMedia.findByIdAndUpdate(
      libraryId,
      { $set: data },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: 'Processing successful completed.', newLibraryMedia });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

const UpdateBgAndTextColorSingleVideo = async (req, res) => {
  try {
    const { backgroundColor, textColor, libraryId } = req.query;

    const libraryData = await LibraryMedia.findById(libraryId);
    if (!libraryData) {
      return res.status(404).json({ msg: 'Library not found!' });
    }

    libraryData.backgroundColor = backgroundColor;
    libraryData.textColor = textColor;
    libraryData.save();

    return res.status(200).json({ msg: 'Successfully updated.', libraryData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

const unlistedViemoVideo = async (req, res) => {
  try {
    const { assetId } = req.query;
    const viemoVideo = await Vimeo.setUnlistedVimeoVideo({
      id: assetId,
    });

    if (!viemoVideo) {
      return res.status(404).json({ msg: 'Unable to get Viemo Video!' });
    }

    return res.status(200).json({ msg: 'successfully unlisted', viemoVideo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

const deleteVimeoVideoByAssetsId = async (req, res) => {
  try {
    const { assetId } = req.query;
    const viemoVideo = await Vimeo.deleteVimeoVideo({
      id: assetId,
    });

    if (!viemoVideo) {
      return res.status(404).send({ msg: 'Not found' });
    }

    return res.status(200).json({ msg: 'Successfully deleted.' });
  } catch (error) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Function to update vimeo video thumbnail from frame
const updateThumbnailOnReplaceVideoFromVimeo = async (req, res) => {
  try {
    const { id, assetId, time } = req.body;
    let thumbnail;
    let isVideo;
    const lastModifyDate = await LibraryMedia.findById(id);
    isVideo = await Vimeo.getVideo({ id: assetId });
    if (
      new Date(isVideo?.modified_time).getTime() ===
      new Date(lastModifyDate?.currentModifyDate).getTime()
    ) {
      res.status(200).json({ msg: 'Already updated.' });
    }
    thumbnail = await Vimeo.createThumbnail({ id: assetId, time });

    if (!thumbnail) {
      return res.status(304).send({ msg: 'Unable to update video thumbnail!' });
    }

    isVideo = await Vimeo.getVideo({ id: assetId });

    const thumbnailUrl = thumbnail?.thumbnail || isVideo?.pictures?.base_link;
    const duration = isVideo?.duration || time;
    const currentModifyDate = isVideo?.modified_time;

    const updatedLibrary = await LibraryMedia.findByIdAndUpdate(
      id,
      { thumbnailUrl, duration, currentModifyDate },
      { new: true }
    );
    await LibraryMedia.updateMany(
      { assetId: assetId },
      {
        $set: {
          duration,
          currentModifyDate,
        },
      }
    );
    if (!updatedLibrary) {
      return res.status(304).send({ msg: 'Unable to update video thumbnail!' });
    }
    return res
      .status(200)
      .json({ msg: 'Thumbnail is updated successfully.', updatedLibrary });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

// Exporting all functions
module.exports = {
  add,
  update,
  getAll,
  remove,
  getById,
  addMany,
  updateShortLink,
  unlistedViemoVideo,
  getSingleViemoVideo,
  downloadLibraryVideo,
  updateThumbnailFromFrame,
  checkAndUpdateReplaceVideo,
  deleteVimeoVideoByAssetsId,
  UpdateBgAndTextColorSingleVideo,
  updateThumbnailOnReplaceVideoFromVimeo,
};
