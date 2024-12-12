const { AlbumShot } = require('../../models/AlbumShot');
const { Album } = require('../../models/Album');
const { ObjectId } = require('../../utils/helper');
const { transcribeVideo } = require('../projects/helper');
const mongoose = require('mongoose');
const { s3 } = require('../../utils/aws');
const User = require('../../models/User');
const { sendEmail } = require('../../utils/emailByPostmark');
const { VideoProject } = require('../../models/VideoProject');

function generateRandomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

exports.allAlbumShot = async (req, res) => {
  try {
    const { search, albumId } = req.query;

    if (!mongoose.isValidObjectId(albumId)) {
      return res.status(400).json({ error: 'Invalid Album ID!' });
    }

    const sortObject = { createdAt: -1 };

    let query = {
      ...(search && { name: new RegExp(`${search}`, 'ig') }),
      ...(albumId && { album: ObjectId(albumId) }),
    };

    const AlbumShotsData = await AlbumShot.find(query).sort(sortObject);

    return res.status(200).json({ data: AlbumShotsData });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.addAlbumShot = async (req, res) => {
  try {
    const { album } = req.body;
    if (!mongoose.isValidObjectId(album)) {
      return res.status(400).json({ error: 'Invalid Album!' });
    }

    const isAlbumExists = await Album.findOne({ _id: ObjectId(album) });
    if (!isAlbumExists) {
      return res.status(404).json({ error: 'Album does not exists.' });
    }
    let shotUrl = `${req.body.name.replace(/ /g, '_')}-${generateRandomString(
      7
    )}`;

    const isShotUrlExists = await AlbumShot.findOne({ shotUrl });
    if (isShotUrlExists) {
      shotUrl = `${req.body.name.replace(/ /g, '_')}-${generateRandomString(
        9
      )}`;
    }

    const newShot = await AlbumShot.create({
      ...req.body,
      shotUrl,
    });
    // Adding albumshot in Album
    isAlbumExists.albumshots?.push(newShot._id);
    isAlbumExists.save();

    return res
      .status(200)
      .json({ msg: 'Albumshot Created successfully', data: newShot });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

exports.getAlbumShotByIdOrShotUrl = async (req, res) => {
  try {
    const { id, shotUrl } = req.query;
    const shortLink = decodeURIComponent(shotUrl);

    if (!(id || shotUrl)) {
      return res.status(400).json({ error: 'Please provide id or scene Url' });
    }

    if (id) {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: 'Invalid id!' });
      }
    }

    const albumShotData = await AlbumShot.findOne(
      {
        ...(id && { _id: ObjectId(id) }),
        ...(shotUrl && { shotUrl: shortLink }),
      },
      { media: 0 }
    )
      .populate('album')
      .lean();

    if (!albumShotData) {
      return res.status(404).json({ error: 'No Album scene found!' });
    }

    return res.status(200).json({ data: albumShotData });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

exports.uploadShotMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { media } = req.body;

    const getAlbumShot = await AlbumShot.findById(id);
    if (!getAlbumShot) {
      return res.status(404).json({ error: 'No Album scene found!' });
    }

    getAlbumShot.media = [...media, ...getAlbumShot.media];
    await getAlbumShot.save();

    const responseData = { ...getAlbumShot._doc, media: getAlbumShot.media };
    res.status(200).json({ data: responseData });

    const transcriptionPromises = media
      .filter((x) => x.fileType === 'video' && !x.transcription)
      .map(async (x) => {
        const { transcription, speakers } = await transcribeVideo({
          TranscriptionJobName: x.name.replace(/[^0-9a-zA-Z._-]+/g, '_'),
          Key: x.s3Key,
        });

        x.transcription = transcription;
        x.speakers = speakers;

        const mediaIndex = getAlbumShot.media.findIndex(
          (mediaItem) => mediaItem.s3Key === x.s3Key
        );

        if (mediaIndex !== -1) {
          getAlbumShot.media[mediaIndex] = x;
          await getAlbumShot.save();
        }

        return x;
      });

    await Promise.all(transcriptionPromises);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.updateAlbumShot = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = { ...req.body };

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid Id!' });
    }

    const updateData = await AlbumShot.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updateData) {
      return res.status(404).json({ error: 'No scene found!' });
    }

    return res
      .status(200)
      .json({ msg: 'Album scene Updated successfully', data: updateData });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};
//
// Function to update short link of a library media
exports.updateAlbumShotUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { shotUrl } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid Id!' });
    }

    if (!shotUrl) {
      return res.status(400).json({ error: 'Please Provide shotUrl' });
    }

    const shortLinkExists = await AlbumShot.findOne({ shotUrl: shotUrl });

    if (shortLinkExists) {
      return res.status(422).send({ error: 'Scene Url already exists!' });
    }

    const updatedAlbum = await AlbumShot.findByIdAndUpdate(
      id,
      { shotUrl },
      { new: true }
    );
    if (!updatedAlbum) {
      return res.status(500).send({ error: 'Error in updating shotUrl' });
    }

    return res
      .status(200)
      .json({ msg: 'Scene Url updated successfully', data: updatedAlbum });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

// Function to update Visibility of a media in Project Media List
exports.updateAlbumShotVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    let { isVisible } = req.query;
    isVisible = JSON.parse(isVisible);

    await AlbumShot.updateOne(
      { 'media._id': id },
      { 'media.$.isVisible': isVisible == false ? false : true }
    );

    let albumShot = await AlbumShot.findOne({ 'media._id': id });
    albumShot = albumShot?.media?.filter((album) => {
      return album._id.toString() == id;
    });

    return res
      .status(200)
      .json({ msg: 'updated successfully', data: albumShot });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.deleteAlbumShot = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoProjectId, userIds } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid Id!' });
    }

    const deletedData = await AlbumShot.findOneAndDelete({ _id: id });

    if (!deletedData) {
      return res.status(404).json({ error: 'No Album scene found!' });
    }

    await Album.findOneAndUpdate(
      { _id: deletedData.album },
      { $pull: { albumshots: deletedData._id } }
    );

    await VideoProject.findOneAndUpdate(
      { albumId: deletedData.album },
      {
        $pull: {
          contributor: {
            $or: [
              { albumShotId: deletedData._id },
              {
                userId: { $in: userIds },
                videoProjectId: videoProjectId,
              },
            ],
          },
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: 'Album scene deleted successfully', data: deletedData });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

exports.removeAlbumShotMedia = async (req, res) => {
  try {
    const { albumshotId, mediaIdsToDelete } = req.query;

    if (!mongoose.isValidObjectId(albumshotId)) {
      return res.status(404).send({ error: 'Invalid Id!' });
    }

    const findAlbumshot = await AlbumShot.findById(ObjectId(albumshotId));

    if (!findAlbumshot) {
      return res.status(404).send({ error: 'Album scene not found!' });
    }
    const mediaKeysToDelete = findAlbumshot?.media
      ?.filter(({ _id }) => mediaIdsToDelete?.includes(_id.toString()))
      .map((x) => x.s3Key);

    findAlbumshot.media = findAlbumshot?.media?.filter(
      ({ _id }) => !mediaIdsToDelete?.includes(_id.toString())
    );
    await Promise.all(
      mediaKeysToDelete.map((Key) => s3.deleteObject({ Key }).promise())
    );
    await findAlbumshot.save();

    return res
      .status(200)
      .json({ msg: 'Media deleted from the album Successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.renameAlbumShotMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaIds, rename } = req.query;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send({ error: 'Invalid Id!' });
    }

    const findAlbumShot = await AlbumShot.findById(ObjectId(id));

    if (!findAlbumShot) {
      return res.status(404).send({ error: 'Album scene not found!' });
    }
    let mediaToUpdate = findAlbumShot?.media?.find(({ _id }) =>
      mediaIds?.includes(_id.toString())
    );
    mediaToUpdate.name = rename;
    await findAlbumShot.save();

    return res.status(200).json({ findAlbumShot, msg: 'media name updated ' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.invitationUserEmail = async (req, res) => {
  try {
    const { subject, body, albumshotId, userId } = req.body;

    if (!mongoose.isValidObjectId(albumshotId)) {
      return res.status(400).json({ error: 'Invalid albumshot ID!' });
    }

    const albumShot = await AlbumShot.findById(albumshotId);
    if (!albumShot) {
      return res.status(400).send({ error: "Albumshot doesn't exits" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ error: "User doesn't exits" });
    }

    if (!albumShot.invites) {
      albumShot.invites = [];
    }
    albumShot.invites?.push({ id: user?._id, lastInvited: new Date() });

    const updatedAlbum = await albumShot.save();
    if (!updatedAlbum) {
      return res
        .status(400)
        .send({ error: 'User not stored', data: updatedAlbum });
    }

    const result = await sendEmail(
      user?.email,
      subject,
      '-----------------------------------',
      body
    );
    return res.status(200).send({
      msg: 'Your invitation is successfully sent.',
      result,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.moveAlbumShot = async (req, res) => {
  try {
    const { moveShot, selectedShot, media } = req.body;

    // Move media to the specified album shot
    const updatedMoveShot = await AlbumShot.findByIdAndUpdate(
      moveShot,
      { $push: { media: media } },
      { new: true }
    );
    if (!updatedMoveShot) {
      return res.status(404).json({ error: 'Move Scene not found!' });
    }

    // Delete media from the selected album shot
    let selectedAlbumShot = await AlbumShot.findById(selectedShot);

    if (!selectedAlbumShot) {
      return res.status(404).json({ error: 'Selected Scene not found!' });
    }

    // Remove the specific media._id from the selected album shot
    selectedAlbumShot.media = selectedAlbumShot?.media?.filter(
      (item) => item?._id?.toString() !== media?._id.toString()
    );

    // Save the updated selected album shot
    const updatedSelectedShot = await selectedAlbumShot.save();

    return res.status(200).json({
      msg: 'Media moved successfully',
      data: { moveShot: updatedMoveShot, selectedShot: updatedSelectedShot },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
