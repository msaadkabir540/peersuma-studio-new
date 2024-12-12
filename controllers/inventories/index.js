const { Inventories } = require('../../models/Inventories');

const addInventory = async (req, res) => {
  try {
    const { name, thumbnailUrl } = req.body;

    if (!name && !thumbnailUrl) {
      return res.status(400).json({ msg: 'Data is Missing' });
    }

    const newInventory = await Inventories.create({
      ...req.body,
    });

    return res
      .status(200)
      .send({ msg: 'successfully Added Inventory', newInventory });
  } catch (err) {
    return res.status(500).send({
      msg: err.message,
    });
  }
};
const sortArrayByCriteria = ({ array, sortBy, sortOrder }) => {
  // Define priorities for both complexity and level sorting in ascending and descending order
  const priorities = {
    complexity: {
      asc: { Simple: 1, Moderate: 2, Complex: 3 },
      desc: { Complex: 1, Moderate: 2, Simple: 3 },
    },
    level: {
      asc: { 'K-2': 1, '3-5': 2, '6-8': 3, '9-12': 4, 'N/A': 5 },
      desc: { 'N/A': 1, '9-12': 2, '6-8': 3, '3-5': 4, 'K-2': 5 },
    },
  };

  const priority = priorities[sortBy]?.[sortOrder] || {};

  return array.sort((a, b) => {
    // Primary sort based on the specified criteria
    if (priority[a[sortBy]] !== priority[b[sortBy]]) {
      return priority[a[sortBy]] - priority[b[sortBy]];
    }
    // Secondary sort by name if primary criteria values are the same
    return a.name.localeCompare(b.name);
  });
};

const getAllInventory = async (req, res) => {
  try {
    const { search = '', sortBy = '', sortOrder = 'asc', category } = req.query;

    // Set the default sorting to 'name' in ascending order if no complex sorting is required
    const sortCriteria =
      sortBy && !['complexity', 'level'].includes(sortBy)
        ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
        : { name: 1 }; // Default sort by 'name' in ascending order

    // Build the query with search and category filters
    const query = {
      ...(search && {
        $or: [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
        ],
      }),
      ...(category && { category: new RegExp(category, 'i') }),
    };

    // Query the database
    const inventoryQuery = Inventories.find(query)
      .collation({ locale: 'en' })
      .sort(sortCriteria);

    const inventory = await inventoryQuery.lean();

    // Apply custom sorting if sortBy is 'complexity' or 'level'
    const sortedInventory = ['complexity', 'level'].includes(sortBy)
      ? sortArrayByCriteria({ array: inventory, sortBy, sortOrder })
      : inventory;

    return res.status(200).json({ allInventory: sortedInventory });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const deleteInventory = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ msg: 'Id is missig' });
    }
    const deletedInventory = await Inventories.findByIdAndDelete(id);
    if (!deletedInventory) {
      return res.status(404).send({ msg: 'Inventory not found' });
    }

    return res.status(200).json({ msg: 'Inventory Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const getInventyById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventyById = await Inventories.findById(id);
    if (!inventyById) {
      return res.status(404).json({ msg: 'No Theme found!' });
    }
    return res.status(200).json(inventyById);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedInventory = await Inventories.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    if (!updatedInventory) {
      return res.status(404).json({ msg: 'Unable To Update Inventory' });
    }

    return res
      .status(200)
      .json({ msg: 'Inventory Updated successfully!', updatedInventory });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

module.exports = {
  addInventory,
  getInventyById,
  updateInventory,
  getAllInventory,
  deleteInventory,
};
