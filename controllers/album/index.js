const { Album } = require('../../models/Album');
const { paginate } = require('../utils');
const { AlbumShot } = require('../../models/AlbumShot');
const { ObjectId } = require('../../utils/helper');
const { transcribeVideo } = require('../projects/helper');
const { VideoProject } = require('../../models/VideoProject');
const Project = require('../../models/Project');

exports.allAlbums = async (req, res) => {
  try {
    const {
      search,
      status,
      producer,
      page = 1,
      clientId,
      limit = 100,
      sortBy = '',
      sortOrder = '',
    } = req.query;

    const sortObject = sortBy
      ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
      : { updatedAt: 1, createdAt: 1 };

    let query = {
      ...(search && { name: new RegExp(`${search}`, 'ig') }),
      ...(status && { status }),
      ...(producer && { producers: ObjectId(producer) }),
    };

    // Add filtering based on the clientId
    if (clientId) {
      query.clientId = clientId;
    }
    if (req?.user?.clientId?._id) {
      query.clientId = req?.user?.clientId?._id;
    }

    const paginatedResult = await paginate(
      Album,
      query,
      sortObject,
      page,
      limit,
      ['clientId', 'producers', 'albumshots']
    );
    const totalPages = Math.ceil(paginatedResult.totalCount / limit);

    const nextPage = page < totalPages ? parseInt(page) + 1 : null;
    const prevPage = page > 1 ? parseInt(page) - 1 : null;

    const resultWithPagination = {
      ...paginatedResult,
      nextPage,
      prevPage,
    };

    return res.status(200).json(resultWithPagination);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.allAlbumData = async (req, res) => {
  try {
    const { search, status, clientId } = req.query;

    const sortObject = { updatedAt: 1, createdAt: 1 };

    let query = {
      ...(search && { name: new RegExp(`${search}`, 'ig') }),
      ...(status && { status }),
    };

    if (clientId) {
      query.clientId = clientId;
    }
    if (req?.user?.clientId?._id) {
      query.clientId = req?.user?.clientId?._id;
    }

    const getAllAlbum = await Album.find(query)
      .sort(sortObject)
      .populate(['clientId', 'albumshots'])
      .lean();

    const resultWithPagination = {
      data: [...getAllAlbum],
    };

    return res.status(200).json(resultWithPagination);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.addAlbum = async (req, res) => {
  try {
    const newAlbum = await Album.create({
      ...req.body,
    });
    const defaultShot = await AlbumShot.create({
      name: 'Default Scene',
      album: newAlbum._id,
      shotUrl: `DefaultScene-${newAlbum?._id?.toString()?.slice(-7)}`,
      isDefault: true,
    });
    newAlbum.albumshots.push(defaultShot?._id);
    await newAlbum.save();

    return res
      .status(200)
      .json({ msg: 'Album Created successfully', newAlbum });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

// Function to get a library media by id
exports.getAlbumById = async (req, res) => {
  try {
    const { id, shortLink } = req.query;
    const shorURl = decodeURIComponent(shortLink);

    const albumData = await Album.findOne({
      ...(id && { _id: ObjectId(id) }),
      ...(shortLink && { shorURl }),
    })
      .populate(['albumshots'])
      .lean();
    if (!albumData) {
      return res.status(404).json({ msg: 'No Album found!' });
    }

    return res.status(200).json(albumData);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { media } = req.body;

    const getAlbum = await Album.findById(id);
    if (!getAlbum) {
      return res.status(404).json({ msg: 'No Albums found!' });
    }

    const uploadTransMedia = await Promise.all(
      media.map(async (x) => {
        if (x.fileType === 'video' && !x.transcription) {
          const { transcription, speakers } = await transcribeVideo({
            TranscriptionJobName: x.name.replace(/[^0-9a-zA-Z._-]+/g, '_'),
            Key: x.s3Key,
          });
          return {
            ...x,
            speakers,
            transcription,
          };
        }
        return x;
      })
    );

    getAlbum.media = [...uploadTransMedia, ...getAlbum.media];
    await getAlbum.save();

    return res.status(200).json(getAlbum);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = { ...req.body };

    const updateData = await Album.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updateData) {
      return res.status(404).json({ msg: 'No Album found!' });
    }

    const videoProjectUpate = await VideoProject.findOneAndUpdate(
      { albumId: updateData?._id },
      {
        $set: {
          name: req.body.name,
        },
      },
      { new: true }
    );

    await Project.findOneAndUpdate(
      { _id: ObjectId(videoProjectUpate?.projectId) },
      {
        $set: {
          projectName: req.body.name,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ msg: 'Album update successfully', updateData });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

// Function to update short link of a library media
exports.updateAlbumShortLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { shortLink } = req.body;

    const shortLinkExists = await Album.findOne({
      _id: { $ne: ObjectId(id) },
      shortLink,
    });
    if (shortLinkExists) {
      return res.status(422).send({ msg: 'Short link already exists!' });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      { shortLink },
      { new: true }
    );
    if (!updatedAlbum) {
      return res.status(404).send({ msg: 'Library Media not found!' });
    }

    return res
      .status(200)
      .json({ msg: 'Short link updated successfully', updatedAlbum });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};
