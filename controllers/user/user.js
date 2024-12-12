const { default: mongoose } = require('mongoose');

const User = require('../../models/User');

const bcrypt = require('bcryptjs');

const { ObjectId } = require('mongoose').Types;

const { VideoProject } = require('../../models/VideoProject');
const { AlbumShot } = require('../../models/AlbumShot');
const { Album } = require('../../models/Album');
const LibraryMedia = require('../../models/LibraryMedia');
const VideoDraft = require('../../models/Draft');
const { handleAllClientRolesFun } = require('../auth/helper');

exports.allUsers = async (req, res) => {
  try {
    const rolesFilter = [];
    const {
      role,
      page,
      search,
      clientId,
      sortBy = '',
      pageSize,
      sortOrder = '',
    } = req.query;

    const sortObject = {
      ...(sortBy
        ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
        : { updatedAt: -1, createdAt: -1 }),
    };

    if (role) {
      if (role.includes('superadmin')) {
        rolesFilter.push({ roles: ['superadmin'] });
      } else if (role && role === 'backend') {
        rolesFilter.push({ roles: 'backend' });
      }
    }

    let query = {
      isDeleted: { $ne: true },
      ...(rolesFilter.length ? { $and: rolesFilter } : {}),
      ...(search && {
        $or: [
          { fullName: new RegExp(search, 'ig') },
          { email: new RegExp(search, 'ig') },
          { contactNumber: new RegExp(search, 'ig') },
        ],
      }),
    };

    if (clientId && role != 'superadmin') {
      query['clientId.clientId'] = clientId;
    }
    if (req?.user?.clientId?._id && role != 'superadmin') {
      query['clientId.clientId'] = req?.user?.clientId?._id;
    }

    if (role && clientId && role != 'superadmin') {
      query['clientId'] = {
        $elemMatch: {
          clientId: ObjectId(clientId),
          role: role,
        },
      };
    }

    let userQuery = User.find(query, { password: 0 })
      .populate('clientId', '-__v')
      .collation({ locale: 'en' })
      .sort(sortObject)
      .lean();

    // Conditionally apply pagination if pageSize and page are provided
    if (page && pageSize) {
      userQuery = userQuery.limit(pageSize).skip(pageSize * (page - 1));
    }
    // Execute the query
    const allUsers = await userQuery.exec();

    const totalCount = await User.countDocuments(query);
    return res.status(200).json({
      count: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      users: allUsers,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req?.params?.id || req?.user?._id;

    const user = await User.findById(id)
      .populate({
        path: 'clientId',
        populate: {
          path: 'clientId',
          model: 'client',
        },
      })
      .lean();
    if (!user) {
      return res.status(404).json({ msg: 'No User found!' });
    }
    if (user?.roles?.[0]?.includes('backend')) {
      const handleAllClientRoles = await handleAllClientRolesFun();

      if (!Array.isArray(user.clientId)) {
        user.clientId = [];
      }

      user.clientId = [...handleAllClientRoles];
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, contactNumber, selectedClientId, role, roles } = req.body;
    const { clientId, ...restParameters } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Check if the email already exists for another user
    if (email !== user.email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
    }
    // Check if the contact number already exists for another user
    if (contactNumber && contactNumber !== user.contactNumber) {
      const existingContactNumberUser = await User.findOne({ contactNumber });
      if (existingContactNumberUser) {
        return res.status(400).json({ msg: 'Contact number already exists' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { ...restParameters } },
      { new: true }
    );
    if (roles !== 'backend') {
      const client = updatedUser?.clientId?.find((client) => {
        return client?.clientId?.toString() === selectedClientId;
      });
      client.role = role || roles;
    }

    await updatedUser.save();

    if (!updatedUser) {
      return res.status(400).json({ msg: 'Unable to update user' });
    }

    return res.status(200).json({ msg: 'Updated successfully!', updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const valid = mongoose.isValidObjectId(id);
    if (!id || id <= 0 || !valid)
      return res.status(400).send({ msg: 'Invalid Id' });
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ msg: 'User Not Found!' });
    }
    await User.updateOne({ _id: id }, { status: !user.status });

    return res.status(200).send({ status: !user.status });
  } catch (err) {
    return res.status(410).json({ msg: err.message });
  }
};

exports.adminBoard = (req, res) => {
  res.status(200).send('Admin Content.');
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate({ _id: id }, { isDeleted: true });

    if (!user) {
      return res.status(404).json({ msg: 'No User found!' });
    }
    return res.status(200).json({ msg: 'User deleted successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

exports.deletePermanentUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.query;

    const videoProjectId = await VideoProject.find({
      createdByUser: id,
      clientId: clientId,
    });

    const videoProjectIdArray = videoProjectId.reduce((acc, videoProject) => {
      acc.push(videoProject?._id);
      return acc;
    }, []);

    await VideoDraft.deleteMany({
      videoProjectId: { $in: videoProjectIdArray },
    });

    await VideoProject.deleteMany({
      createdByUser: id,
      clientId: clientId,
    });

    await LibraryMedia.deleteMany({
      userId: id,
      clientId,
    });

    const findAllAlbumByUser = await Album.find({
      createdByUser: id,
      clientId: clientId,
    });

    const albumIdsList = [
      ...findAllAlbumByUser.reduce((acc, album) => {
        acc.push(album?._id);
        return acc;
      }, []),
    ];

    await AlbumShot.deleteMany({
      album: { $in: albumIdsList },
    });

    await Album.deleteMany({
      createdByUser: id,
      clientId: clientId,
    });

    const userData = await User.findById(id);

    if (userData) {
      userData.clientId = userData?.clientId?.filter((client) => {
        return !ObjectId(client?.clientId).equals(ObjectId(clientId));
      });

      if (userData.clientId.length === 0) {
        await User.findByIdAndDelete(id);
      } else {
        await userData.save();
      }
    }

    return res.status(200).json({ msg: 'User deleted successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

exports.updateAllUser = async (req, res) => {
  try {
    // Update users using aggregation pipeline
    const updatedUsers = await User.aggregate([
      {
        $match: { clientId: { $exists: true } },
      },
      {
        $addFields: {
          clientId: {
            $cond: {
              if: { $isArray: '$clientId' },
              then: {
                $map: {
                  input: '$clientId',
                  as: 'client',
                  in: {
                    clientId: '$$client._id',
                    role: { $arrayElemAt: ['$roles', 0] },
                  },
                },
              },
              else: [
                {
                  clientId: '$clientId',
                  role: { $arrayElemAt: ['$roles', 0] },
                },
              ],
            },
          },
        },
      },
      {
        $unset: 'roles', // Remove the roles array after assigning the role to the clientId
      },
    ]);

    // Update each document in the database
    const bulkOps = updatedUsers.map((user) => ({
      updateOne: {
        filter: { _id: ObjectId(user._id) },
        update: { $set: { clientId: user.clientId } },
      },
    }));

    // Execute bulkWrite operation to save the updates
    await User.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: 'Users updated successfully',
    });
  } catch (error) {
    console.error('Error updating users:', error);
    res.status(500).json({ success: false, message: 'Error updating users' });
  }
};

// create super admin create

exports.createSuperAdmin = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      fullName,
      contactNumber,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    // If user does not exist, create a new user
    const user = await User.create({
      email,
      username: username,
      fullName: fullName,
      roles: ['superadmin'],
      contactNumber: contactNumber,
      password: bcrypt.hashSync(password, 8),
    });

    await user.save();

    return res
      .status(200)
      .json({ msg: 'super admin registered successfully!' });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};
