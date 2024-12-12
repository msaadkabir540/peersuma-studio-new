const Themes = require('../../models/Themes');
const { s3 } = require('../../utils/aws');

require('dotenv').config();

const addThemes = async (req, res) => {
  try {
    const {
      themeName,
      themesDescription,
      themes_py,
      sampleVideoUrl,
      sampleVideoS3Key,
      themeVideoThumbnailUrl,
    } = req.body;

    const themeData = new Themes({
      themeName: themeName,
      themesDescription: themesDescription,
      themes_py: themes_py,
      sampleVideoUrl: sampleVideoUrl,
      sampleVideoS3Key: sampleVideoS3Key,
      themeVideoThumbnailUrl: themeVideoThumbnailUrl,
    });

    await themeData.save();

    return res
      .status(200)
      .send({ msg: 'successfully Added Themes', themeData });
  } catch (err) {
    return res.status(500).send({
      msg: err.message,
    });
  }
};

const getAllThemes = async (req, res) => {
  try {
    const { params } = req.query;
    const { search, sortBy = '', sortOrder = '' } = params;
    const sortObject = {
      ...(sortBy
        ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
        : { themeName: 1 }),
    };

    const allThemes = await Themes.find({
      ...(search && { themeName: new RegExp(search, 'i') }),
    })
      .collation({ locale: 'en' })
      .sort(sortObject)
      .lean();

    return res.status(200).json({ allThemes });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const deleteThemes = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedThemes = await Themes.findByIdAndDelete(id);
    if (!deletedThemes) {
      return res.status(404).send({ msg: 'Theme not found' });
    }

    const fileKeys = [];

    deletedThemes?.sampleVideoS3Key &&
      fileKeys.push(deletedThemes?.sampleVideoS3Key);
    deletedThemes?.sampleVideoUrl &&
      fileKeys.push(deletedThemes?.sampleVideoUrl);
    deletedThemes?.themeVideoThumbnailUrl &&
      fileKeys.push(deletedThemes?.themeVideoThumbnailUrl);

    await Promise.all(
      fileKeys.map(async (Key) => await s3.deleteObject({ Key }).promise())
    );

    return res.status(200).json({ msg: 'Theme Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const getThemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const themes = await Themes.findById(id).lean();
    if (!themes) {
      return res.status(404).json({ msg: 'No Theme found!' });
    }
    return res.status(200).json(themes);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const updateThemes = async (req, res) => {
  try {
    const { id } = req.params;
    const { sampleVideoS3Key } = req.body;
    const checkS3keyFile = await Themes.findByIdAndUpdate(id);

    if (checkS3keyFile && sampleVideoS3Key) {
      const fileKeys = [];

      checkS3keyFile?.sampleVideoS3Key &&
        fileKeys.push(checkS3keyFile?.sampleVideoS3Key);
      checkS3keyFile?.sampleVideoUrl &&
        fileKeys.push(checkS3keyFile?.sampleVideoUrl);
      checkS3keyFile?.themeVideoThumbnailUrl &&
        fileKeys.push(checkS3keyFile?.themeVideoThumbnailUrl);

      await Promise.all(
        fileKeys.map(async (Key) => await s3.deleteObject({ Key }).promise())
      );
    }
    const updatedThemes = await Themes.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    if (!updatedThemes) {
      return res.status(404).json({ msg: 'Unable To Update Template' });
    }

    return res
      .status(200)
      .json({ msg: 'Template Updated successfully!', updatedThemes });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

module.exports = {
  addThemes,
  getAllThemes,
  deleteThemes,
  getThemeById,
  updateThemes,
};
