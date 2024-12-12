// Create multiple media files at once

const TemplateMedia = require('../../models/TemplateMedia');
const TemplateMediaCategory = require('../../models/TemplateMediaCategory');

const { s3 } = require('../../utils/aws');
const { ObjectId } = require('../../utils/helper');

exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 30,
      search = '',
      categories = [],
      sortBy = '',
      sortOrder = '',
    } = req.query;
    const fileTypes = req.query?.['file-types'] || [];

    const sortObject = {
      ...(sortBy
        ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
        : { updatedAt: -1, createdAt: -1 }),
    };

    const media = await TemplateMedia.find({
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      }),
      ...(categories.length > 0 && { categories: { $in: categories } }),
      ...(fileTypes.length > 0 && { fileType: { $in: fileTypes } }),
    })
      .populate('categories', 'name')
      .sort(sortObject)
      .limit(pageSize * 1)
      .skip((page - 1) * pageSize)
      .exec();

    const count = await TemplateMedia.countDocuments({
      ...(search && { name: { $regex: search, $options: 'i' } }),
      ...(categories.length > 0 && { categories: { $in: categories } }),
      ...(fileTypes.length > 0 && { fileType: { $in: fileTypes } }),
    });

    return res.status(200).json({
      media,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.getAllTypesAndCategories = async (req, res) => {
  try {
    let [fileTypes, categories] = await Promise.all([
      (
        await TemplateMedia.aggregate([
          {
            $group: {
              _id: '$fileType',
            },
          },
        ])
      ).map(({ _id }) => ({
        label: _id.charAt(0).toUpperCase() + _id.slice(1),
        value: _id,
      })),
      (
        await TemplateMediaCategory.aggregate([
          { $sort: { updatedAt: -1, createdAt: -1 } },
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ])
      ).map(({ _id, name }) => ({
        label: name.charAt(0).toUpperCase() + name.slice(1),
        value: _id,
      })),
    ]);

    return res.status(200).json({
      fileTypes,
      categories,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.createMedia = async (req, res) => {
  try {
    const { mediaFiles } = req.body; // array of media files to create

    // Use Mongoose to insert multiple documents at once
    const newMediaFiles = await TemplateMedia.insertMany(mediaFiles);

    // Return the inserted media files as a response
    return res.status(200).json({ newMediaFiles });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: err?.message });
  }
};

exports.updateTemplateMedia = async (req, res) => {
  try {
    const { id, oldKey, newKey, newFileName, newUrl, categories, description } =
      req.body;

    if (!id) {
      return res.status(400).json({ msg: 'Invalid File Id!' });
    }

    const nameChanged =
      newFileName?.split('_20')?.[0] !==
      oldKey?.split('_20')?.[0]?.split('_media/')?.[1];
    if (nameChanged) {
      await s3
        .copyObject({
          CopySource: `/${process.env.AWS_BUCKET_NAME}/${oldKey}`,
          Key: newKey,
          ACL: 'public-read',
        })
        .promise();

      await s3.deleteObject({ Key: oldKey }).promise();
    }

    const updateMedia = await TemplateMedia.updateOne(
      {
        _id: ObjectId(id),
      },
      {
        ...(nameChanged && {
          url: newUrl,
          s3Key: newKey,
          name: newFileName,
          description: description,
        }),
        ...(description && { description: description }),
        ...(categories?.length > 0 ? { categories } : { categories: [] }),
      }
    );
    if (!updateMedia) {
      return res.status(401).json({ msg: 'Unable to update Template Media!' });
    }
    const updatedMedia = await TemplateMedia.findOne({
      _id: ObjectId(id),
    }).populate('categories', 'name');

    return res.status(200).json({
      msg: `Successfully renamed object from ${oldKey} to ${newKey}`,
      updatedMedia,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.updateTemplateUploadFile = async (req, res) => {
  try {
    const { id, oldKey, uploads } = req.body;
    const getUploadMedia = {
      updateS3key: uploads[0]?.s3Key,
      updateUrl: uploads[0]?.url,
      updateFileSize: uploads[0]?.fileSize,
      updateFileType: uploads[0]?.fileType,
      updatedDuration: uploads[0]?.duration,
      updatedThumbnailUrl: uploads[0]?.thumbnailUrl,
      updatedThumbnailS3Key: uploads[0]?.thumbnailS3Key,
    };

    const checkTemplateMedia = await TemplateMedia.findOne({
      _id: ObjectId(id),
    });
    if (!checkTemplateMedia) {
      return res.status(400).json({ msg: 'Invalid File Id!' });
    }

    if (getUploadMedia.updateFileType === 'video') {
      const updateMedia = await TemplateMedia.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          s3Key: getUploadMedia.updateS3key,
          url: getUploadMedia.updateUrl,
          fileSize: getUploadMedia.updateFileSize,
          fileType: getUploadMedia.updateFileType,
          duration: getUploadMedia.updatedDuration,
          thumbnailS3Key: getUploadMedia.updatedThumbnailS3Key,
          thumbnailUrl: getUploadMedia.updatedThumbnailUrl,
        }
      );
      if (!updateMedia) {
        return res
          .status(401)
          .json({ msg: 'Unable to update Template Media!' });
      }
    } else {
      const updateMedia = await TemplateMedia.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          url: getUploadMedia.updateUrl,
          s3Key: getUploadMedia.updateS3key,
          fileSize: getUploadMedia.updateFileSize,
          fileType: getUploadMedia.updateFileType,
        }
      );
      if (!updateMedia) {
        return res
          .status(401)
          .json({ msg: 'Unable to update Template Media!' });
      }
    }

    const updatedMedia = await TemplateMedia.findOne({
      _id: ObjectId(id),
    }).lean();

    return res.status(200).json({
      msg: `Successfully update media object from ${oldKey} to ${getUploadMedia.updateS3key}`,
      updatedMedia,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.deleteTemplateMedia = async (req, res) => {
  try {
    const { s3Key } = req.query;
    if (!s3Key) {
      return res.status(400).json({ msg: 'Invalid s3Key!' });
    }

    const media = await TemplateMedia.findOne({ s3Key });

    const deleteMedia = await TemplateMedia.deleteOne({ s3Key });
    if (!deleteMedia) {
      return res.status(401).json({ msg: 'Unable to delete Template Media!' });
    }

    await s3.deleteObject({ Key: s3Key }).promise();
    media?.thumbnailS3Key &&
      (await s3.deleteObject({ Key: media?.thumbnailS3Key }).promise());

    return res.status(200).json({ media, msg: 'File Deleted Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.getTemplateMediaById = async (req, res) => {
  try {
    const { id } = req.params;
    const templateMedia = await TemplateMedia.findById(id);
    if (!templateMedia) {
      return res.status(404).json({ msg: 'No Template Media!' });
    }
    return res.status(200).json(templateMedia);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};
