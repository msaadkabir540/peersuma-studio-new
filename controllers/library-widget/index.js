// Importing required modules
const Widget = require('../../models/Widget');

// Function to update a library widget
const update = async (req, res) => {
  try {
    // Extract the id from request parameters
    const { id } = req.params;

    // Update the widget with new media
    const updatedWidget = await Widget.findByIdAndUpdate(
      id,
      { $set: { media: req.body.media } },
      { new: true }
    );

    // Check if widget update was successful
    if (!updatedWidget) {
      return res.status(404).json({ msg: 'Unable to update Library Widget!' });
    }

    return res
      .status(200)
      .json({ msg: 'Library Widget updated successfully.', updatedWidget });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Function to shift down the media order in the widget
const shiftDown = async (req, res) => {
  try {
    // Extract id and current order from request
    const { id } = req.params;
    const { currentOrder } = req.body;

    // If currentOrder is not provided, return an error
    if (!currentOrder) {
      return res.status(400).json({ msg: 'Invalid current media order' });
    }

    // Fetch the widget by id
    const widget = await Widget.findById(id, 'media');

    // Check if the widget exists
    if (!widget) {
      return res.status(404).json({ msg: 'Widget not found' });
    }

    // Fetch the media array from the widget
    const media = widget.media;

    // Find the media items for the current order and the next order
    const mediaAtCurrentOrder = media.find(
      ({ order }) => order === currentOrder
    );
    const mediaAtNextOrder = media.find(
      ({ order }) => order === currentOrder + 1
    );

    // Check if the media items exist for both orders
    if (!mediaAtCurrentOrder) {
      return res.status(400).json({ msg: 'No media found at current orders' });
    }
    if (!mediaAtNextOrder) {
      return res.status(400).json({ msg: 'Unable to shift down further!' });
    }

    // Swap the order of the media items
    mediaAtCurrentOrder.order = currentOrder + 1;
    mediaAtNextOrder.order = currentOrder;

    // Sort and re-index the media array by order
    widget.media = widget.media.sort((a, b) => a.order - b.order);
    widget.media = widget.media.map(({ _id }, index) => ({
      _id,
      order: index + 1,
    }));

    // Save the updated widget
    await widget.save();

    res.json({ message: 'Media order shifted down successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Unable to shift media down!' });
  }
};

// Function the media order in the widget
const mediaReOrder = async (req, res) => {
  try {
    // Extract id and current order from request
    const { _id, media } = req.body;
    // check the widget by _id
    const widget = await Widget.findById(_id, 'media');
    if (!widget) {
      return res.status(404).json({ msg: 'Widget not found' });
    }
    //update the media
    widget.media = media;

    //Save the updated widget document
    await widget.save();

    res.json({ message: 'Media updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'unable to update the media' });
  }
};

// Function to remove a media from a widget
const remove = async (req, res) => {
  try {
    // Extract id and media id from request query
    const { id, mediaId } = req.query;

    // Fetch the widget by id
    const widget = await Widget.findById(id, 'media');

    // Check if the widget exists
    if (!widget) {
      return res.status(404).json({ msg: 'Widget not found' });
    }

    // Filter the media array to remove the specified media id
    widget.media = widget.media.filter(({ _id }) => _id.toString() !== mediaId);

    // Sort and re-index the media array by order
    widget.media = widget.media.sort((a, b) => a.order - b.order);
    widget.media = widget.media.map(({ _id }, index) => ({
      _id,
      order: index + 1,
    }));

    // Save the updated widget
    await widget.save();

    return res
      .status(200)
      .json({ msg: 'Library Widget media removed Successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

// Export the functions
module.exports = {
  remove,
  update,
  shiftDown,
  mediaReOrder,
};
