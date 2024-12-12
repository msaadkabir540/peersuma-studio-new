const { VideoRequests } = require('../../models/VideoRequests');
const { VideoRequestThemes } = require('../../models/VideoRequestThemes');
const { ObjectId } = require('../../utils/helper');

const addVideoRequestsThemes = async (req, res) => {
  try {
    const newVideothemeData = await VideoRequestThemes.create({
      ...req.body,
    });

    return res
      .status(200)
      .send({ msg: 'successfully Added', newVideothemeData });
  } catch (err) {
    return res.status(500).send({
      msg: err.message,
    });
  }
};

const getAllVideoRequestsThemes = async (req, res) => {
  try {
    const { clientId, schoolYear } = req.query;

    if (!clientId) {
      return res.status(400).json({ msg: 'School is missig' });
    }
    if (!schoolYear) {
      return res.status(400).json({ msg: 'School Year is missig' });
    }

    const allVideoRequestsThemes = await VideoRequestThemes.find({
      clientId: ObjectId(clientId),
      schoolYear,
    })
      .populate({
        path: 'videoRequestIds.videoRequestId',
        populate: [
          {
            path: 'assignTo',
            model: 'user',
          },
          {
            path: 'userId',
            model: 'user',
            select: 'username',
          },
        ],
      })
      .collation({ locale: 'en' })
      .lean();

    allVideoRequestsThemes.forEach((theme) => {
      theme.videoRequestIds = theme?.videoRequestIds?.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    });

    const customSort = (a, b) => {
      const dateA = new Date(a.fromDate);
      const dateB = new Date(b.fromDate);
      return dateA - dateB;
    };

    // // Sort the data after retrieving it
    allVideoRequestsThemes.sort(customSort);
    return res.status(200).json({ allVideoRequestsThemes });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const getVideoThemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const videoThemeById = await VideoRequestThemes.findById(id);
    if (!videoThemeById) {
      return res.status(404).json({ msg: 'No video theme found!' });
    }
    return res.status(200).json(videoThemeById);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const updateVideoThemes = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedVideoThemes = await VideoRequestThemes.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    if (!updatedVideoThemes) {
      return res.status(404).json({ msg: 'Unable To Update' });
    }

    return res.status(200).json({
      msg: ' Video themes updated successfully!',
      updatedVideoThemes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

const updateVideoRequestIds = async (req, res) => {
  try {
    const { id } = req.params; // VideoRequestThemes ID
    const { videoRequestId, orderNumber } = req.body; // New video request ID and order number

    // Validate input
    if (!id || !videoRequestId) {
      return res.status(400).json({ msg: 'Invalid input parameters.' });
    }

    // Find the theme document by ID
    const updatedVideoThemes = await VideoRequestThemes.findById(id);

    if (!updatedVideoThemes) {
      return res.status(404).json({ msg: 'VideoRequestThemes not found.' });
    }

    // Ensure videoRequestIds is initialized as an array
    if (!updatedVideoThemes.videoRequestIds) {
      updatedVideoThemes.videoRequestIds = [];
    }

    // Place the new item at the specified orderNumber or at 0 by default
    const insertAtOrder = typeof orderNumber === 'number' ? orderNumber : 0;

    // Shift existing items' orderNumbers to accommodate the new entry
    updatedVideoThemes.videoRequestIds = [
      ...updatedVideoThemes.videoRequestIds.map((item) => ({
        ...item,
        orderNumber:
          item.orderNumber >= insertAtOrder
            ? item.orderNumber + 1
            : item.orderNumber,
      })),
      { orderNumber: insertAtOrder, videoRequestId },
    ];

    // Sort by orderNumber to ensure consistent ordering
    updatedVideoThemes.videoRequestIds.sort(
      (a, b) => a.orderNumber - b.orderNumber
    );

    // Save the updated document
    await updatedVideoThemes.save();

    return res.status(200).json({
      msg: 'Updated successfully!',
      updatedVideoThemes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

const removeVideoRequestIds = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoRequestId } = req.body;
    const updatedVideoThemes = await VideoRequestThemes.findById(id);

    updatedVideoThemes.videoRequestIds =
      updatedVideoThemes.videoRequestIds?.filter(
        (item) => item.videoRequestId.toString() !== videoRequestId
      );

    await updatedVideoThemes.save();
    if (!updatedVideoThemes) {
      return res.status(404).json({ msg: 'Unable To Update' });
    }

    return res.status(200).json({
      msg: 'updated successfully!',
      updatedVideoThemes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

const deleteVideoRequestTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideoRequestThemes =
      await VideoRequestThemes.findByIdAndDelete(id);

    await VideoRequests.deleteMany({
      themeId: { $in: ObjectId(id) },
    });

    if (!deletedVideoRequestThemes) {
      return res.status(404).json({ msg: 'Unable To delete' });
    }

    return res.status(200).json({
      msg: 'Successfully deleted!',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

const changeVideoRequestTheme = async (req, res) => {
  try {
    const { changeVideoRequestThemeIds } = req.body;
    const { videoRequestId, themeIdRemove, themeIdAdd, orderNumber } =
      changeVideoRequestThemeIds;

    if (
      !videoRequestId ||
      themeIdRemove == null ||
      themeIdAdd == null ||
      orderNumber == null
    ) {
      return res.status(400).json({ msg: 'Invalid input data' });
    }

    if (themeIdRemove === themeIdAdd) {
      // Handle reordering within the same theme
      const theme = await VideoRequestThemes.findById(themeIdRemove);
      if (!theme) {
        return res.status(404).json({ msg: 'Theme not found.' });
      }

      // Remove the videoRequestId from its current position
      const itemToMove = theme.videoRequestIds.find(
        (item) => item.videoRequestId.toString() === videoRequestId
      );

      if (!itemToMove) {
        return res
          .status(404)
          .json({ msg: 'Video request ID not found in the theme.' });
      }

      // Remove the item from its current position
      theme.videoRequestIds = theme.videoRequestIds.filter(
        (item) => item.videoRequestId.toString() !== videoRequestId
      );

      // Adjust the orderNumber of the remaining items
      theme.videoRequestIds = theme.videoRequestIds.map((item, index) => ({
        ...item,
        orderNumber: index,
      }));

      // Insert the item at the new position
      theme.videoRequestIds.splice(orderNumber, 0, {
        orderNumber,
        videoRequestId,
      });

      // Adjust orderNumbers again to ensure consistency
      theme.videoRequestIds = theme.videoRequestIds.map((item, index) => ({
        ...item,
        orderNumber: index,
      }));

      await theme.save();

      return res.status(200).json({
        msg: 'Video request reordered successfully!',
        updatedTheme: theme,
      });
    }

    // Handle moving the videoRequestId between different themes
    const addVideoThemes = await VideoRequestThemes.findById(themeIdAdd);
    const removeVideoThemes = await VideoRequestThemes.findById(themeIdRemove);

    if (!addVideoThemes || !removeVideoThemes) {
      return res.status(404).json({ msg: 'One or both themes not found.' });
    }

    // Remove the videoRequestId from the source theme
    removeVideoThemes.videoRequestIds =
      removeVideoThemes.videoRequestIds.filter(
        (item) => item.videoRequestId.toString() !== videoRequestId
      );

    // Reorder the remaining items in the source theme
    removeVideoThemes.videoRequestIds = removeVideoThemes.videoRequestIds.map(
      (item, index) => ({
        ...item,
        orderNumber: index,
      })
    );

    // Shift orderNumber in the target theme for items at or after the insertion point
    addVideoThemes.videoRequestIds = addVideoThemes.videoRequestIds.map(
      (item) => ({
        ...item,
        orderNumber:
          item.orderNumber >= orderNumber
            ? item.orderNumber + 1
            : item.orderNumber,
      })
    );

    // Add the videoRequestId to the target theme at the specified orderNumber
    addVideoThemes.videoRequestIds.splice(orderNumber, 0, {
      orderNumber,
      videoRequestId,
    });

    // Reorder all items in the target theme to ensure sequential orderNumbers
    addVideoThemes.videoRequestIds = addVideoThemes.videoRequestIds.map(
      (item, index) => ({
        ...item,
        orderNumber: index,
      })
    );

    // Save the updated themes
    await removeVideoThemes.save();
    await addVideoThemes.save();

    return res.status(200).json({
      msg: 'Video request moved successfully!',
      removeVideoThemes,
      addVideoThemes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getVideoThemeById,
  updateVideoThemes,
  removeVideoRequestIds,
  updateVideoRequestIds,
  addVideoRequestsThemes,
  changeVideoRequestTheme,
  deleteVideoRequestTheme,
  getAllVideoRequestsThemes,
};
