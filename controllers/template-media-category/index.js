const TemplateMedia = require('../../models/TemplateMedia');
const TemplateMediaCategory = require('../../models/TemplateMediaCategory');

const { ObjectId } = require('../../utils/helper');

exports.getAll = async (req, res) => {
  try {
    // const categories = await TemplateMediaCategory.find().populate("");
    const categories = await TemplateMediaCategory.aggregate([
      {
        $lookup: {
          from: 'template-medias',
          localField: '_id',
          foreignField: 'categories',
          as: 'media',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          updatedAt: 1,
          createdAt: 1,
          count: { $size: '$media' },
        },
      },
      { $sort: { updatedAt: -1, createdAt: -1 } },
    ]);

    return res.status(200).json({ categories });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const categoryExists = await TemplateMediaCategory.findOne({ name });
    if (categoryExists) {
      return res
        .status(401)
        .json({ msg: 'This Category Name Already Exists!' });
    }

    const newCategory = await TemplateMediaCategory.create({ name });

    // Return the created category as a response
    return res.status(200).json({ newCategory });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: err?.message });
  }
};

exports.updateTemplateMediaCategory = async (req, res) => {
  try {
    const { _id, name } = req.body;

    if (!_id || !ObjectId.isValid(_id)) {
      return res.status(400).json({ msg: 'Invalid Category Id!' });
    }

    const updatedCategory = await TemplateMediaCategory.findOneAndUpdate(
      {
        _id: ObjectId(_id),
      },
      {
        name,
      },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(401).json({ msg: 'Unable to update Category Name!' });
    }

    return res
      .status(200)
      .json({ msg: `Successfully updated Category`, updatedCategory });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.deleteTemplateMediaCategory = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!_id || !ObjectId.isValid(_id)) {
      return res.status(400).json({ msg: 'Invalid Category ID!' });
    }

    const deletedCategory = await TemplateMediaCategory.findByIdAndDelete(_id);
    await TemplateMedia.updateMany(
      { 'categories._id': _id },
      { $pull: { 'categories._id': _id } }
    );
    if (!deletedCategory) {
      return res
        .status(401)
        .json({ msg: 'Unable to delete Template Media Category!' });
    }

    return res.status(200).json({ msg: 'Category Deleted Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};
