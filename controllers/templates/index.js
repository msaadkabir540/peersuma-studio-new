const Template = require('../../models/Template');

const { s3 } = require('../../utils/aws');
const { ObjectId } = require('../../utils/helper');

require('dotenv').config();

const add = async (req, res) => {
  try {
    req.body.ssJson = JSON.stringify(req.body.ssJson);

    const newTemplate = await Template.create({
      ...req.body,
    });
    return res
      .status(200)
      .json({ msg: 'Template Created successfully', newTemplate });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    req.body.ssJson = JSON.stringify(req.body.ssJson);
    const prevTemplate = await Template.findById(id).lean();

    const prevTemplateStyles = prevTemplate?.templateStyles?.map(
      (x) => x?.sampleVideoS3Key
    );
    const newTemplateStyles = req?.body?.templateStyles?.map(
      (x) => x?.sampleVideoS3Key
    );

    const deletedTemplateStylesVideoKeys = prevTemplateStyles?.filter(
      (x) => x && !newTemplateStyles?.includes(x)
    );

    prevTemplate?.templateVideoS3Key &&
      prevTemplate?.templateVideoS3Key !== req?.body?.templateVideoS3Key &&
      deletedTemplateStylesVideoKeys.push(prevTemplate?.templateVideoS3Key);
    prevTemplate?.templateVideoThumbnailS3Key &&
      prevTemplate?.templateVideoThumbnailS3Key !==
        req?.body?.templateVideoThumbnailS3Key &&
      deletedTemplateStylesVideoKeys.push(
        prevTemplate?.templateVideoThumbnailS3Key
      );

    // delete the deleted styles sample videos from s3
    if (deletedTemplateStylesVideoKeys?.length > 0) {
      await Promise.all(
        [...deletedTemplateStylesVideoKeys].map(async (Key) => {
          await s3.deleteObject({ Key }).promise();
        })
      );
    }

    const newTemplate = await Template.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    if (!newTemplate) {
      return res.status(404).json({ msg: 'Unable To Update Template' });
    }

    return res
      .status(200)
      .json({ msg: 'Template Updated successfully!', newTemplate });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

const getAll = async (req, res) => {
  try {
    const { prefix, selectBox, sortBy = '', sortOrder = '' } = req.query;
    const sortObject = {
      ...(sortBy
        ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
        : { templateName: 1 }),
    };

    const allTemplates = await Template.find({
      ...(prefix && { templateName: new RegExp(`^${prefix}`, 'i') }),
    })
      .collation({ locale: 'en' })
      .sort(sortObject)
      .lean();

    // if api is called to fetch data for select-box
    const selectBoxOptions = selectBox
      ? allTemplates.map(({ _id, templateName, description }) => ({
          label: templateName,
          value: _id,
          description,
        }))
      : [];

    // if api is called to fetch data for table
    const templatesData = !selectBox
      ? allTemplates.map((x) => ({
          ...x,
          mediaFilesCount: x?.mediaFiles?.length,
        }))
      : [];

    return res.status(200).json({
      count: allTemplates.length,
      allTemplates: selectBox ? selectBoxOptions : templatesData,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id).lean();
    if (!template) {
      return res.status(404).json({ msg: 'No template found!' });
    }
    return res.status(200).json(template);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedTemplate = await Template.findByIdAndDelete(id);
    if (!deletedTemplate) {
      return res.status(404).send({ msg: 'Template not found' });
    }

    const fileKeys = [];

    deletedTemplate?.templateVideoS3Key &&
      fileKeys.push(deletedTemplate?.templateVideoS3Key);
    deletedTemplate?.templateVideoThumbnailS3Key &&
      fileKeys.push(deletedTemplate?.templateVideoThumbnailS3Key);
    const sampleVideoKeys = deletedTemplate?.templateStyles
      .filter((x) => x.sampleVideoKey)
      .map((x) => x.sampleVideoKey);
    sampleVideoKeys.length > 0 && fileKeys.push(...sampleVideoKeys);

    await Promise.all(
      fileKeys.map(async (Key) => await s3.deleteObject({ Key }).promise())
    );

    return res.status(200).json({ msg: 'Template Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { Key, id, keyName } = req.query;

    if (id && keyName) {
      const updatedTemplate = await Template.findOneAndUpdate(
        { _id: ObjectId(id), [keyName]: { $exists: true } },
        {
          ...(keyName === 'mediaFiles' && {
            $pull: { mediaFiles: { name: Key.split('templates_media/')[1] } },
          }),
        }
      );
      if (!updatedTemplate) {
        return res.status(404).send({ msg: 'Template not found' });
      }
    }

    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key,
      })
      .promise();

    return res.status(200).json({ msg: 'Template file Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

module.exports = { add, getAll, remove, deleteFile, getById, update };
