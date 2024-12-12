const { default: mongoose } = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth');

const Client = require('../../models/Client');
const User = require('../../models/User');

const { Vimeo } = require('../../utils/vimeo');

const { sentEmail } = require('../../utils/emailByPostmark');
const { sendLoginSMS, sendEmailToAlanOnBoding } = require('../auth/send-sms');
const { sendWelcomeEmail } = require('./welcome-email/email-servies');

/**
 * Create Client and store data in msngo collection Client,
 * Request data should be json body.
 * @param {name: 'Name of Client/School/District', 'website': 'School website Address'} req
 * @returns {object} document of client
 */

const createUserOnBoding = async ({
  newUser,
  newClient,
  excProdName,
  executiveProducerEmail,
  executiveProducerContact,
}) => {
  const hashedPassword = bcrypt.hashSync('executiveProducerEmail', 8);
  let clientIdsArray = [];
  if (newClient._id) {
    clientIdsArray.push({
      clientId: newClient?._id,
      role: 'executive-producer',
    });
  }

  const userExist = await User.findOne({
    $or: [
      { email: executiveProducerEmail },
      { contactNumber: executiveProducerContact },
    ],
  });
  if (!userExist) {
    newUser = await User.create({
      username: excProdName,
      fullName: excProdName,
      status: true,
      email: executiveProducerEmail,
      contactNumber: executiveProducerContact,
      password: hashedPassword,
      clientId: clientIdsArray,
      roles: 'executive-producer',
    });

    if (newUser?._id) {
      await Client.updateOne(
        { _id: newClient._id },
        { $push: { userIds: newUser._id } }
      );
    }

    // send mail to alan onboarding time
    const alanMail = sendEmailToAlanOnBoding({
      email: newUser?.email,
      contactNumber: newUser?.contactNumber,
    });
    await sentEmail(alanMail);
  } else {
    await Client.updateOne(
      { _id: userExist._id },
      { $push: { userIds: userExist._id } }
    );

    await User.updateOne(
      { _id: userExist._id },
      {
        $push: {
          clientId: {
            clientId: newClient?._id,
            role: 'executive-producer',
          },
        },
      }
    );

    newUser = userExist;
  }

  const tokenData = {
    userId: newUser?._id,
    roles: newUser?.roles,
    clientId: newUser?.clientId,
    selectedClientId: newClient?._id,
  };
  const token = jwt.sign({ ...tokenData }, config.secret, {
    algorithm: 'HS256',
    allowInsecureKeySizes: true,
  });
  const projectsPeersuma = `${
    process.env.VIDEO_PROJECT_URL
  }/authentication?accessToken=${encodeURIComponent(token)}`;

  let emailFormateResult;
  if (newUser?.email) {
    emailFormateResult = sendWelcomeEmail({
      clinentName: newClient?.name,
      userName: newUser?.username || newUser?.fullName,
      email: newUser?.email,
      videoProjectLink: projectsPeersuma,
    });
  }

  await sentEmail(emailFormateResult);

  if (newUser?.isAllowContact) {
    await sendLoginSMS({
      siteName: 'project.peersuma.com',
      link: projectsPeersuma,
      contactNumber: newUser?.contactNumber,
    });
  }

  return newUser;
};

const add = async (req, res) => {
  try {
    const {
      excProdName,
      vimeoFolderName,
      executiveProducerEmail,
      executiveProducerContact,
    } = req.body;

    const createFolderRes = await Vimeo.createFolder({ name: vimeoFolderName });
    if (!createFolderRes) {
      return res
        .status(500)
        .json({ msg: "Unable to create client's folder on vimeo" });
    }

    const newClient = await Client.create({
      ...req.body,
      vimeoFolderId: createFolderRes.uri.split('/').pop(),
    });

    let newUser;
    if (newClient) {
      newUser = await createUserOnBoding({
        newUser,
        newClient,
        excProdName,
        executiveProducerEmail,
        executiveProducerContact,
      });
    }

    return res.status(200).json({
      newClient,
      newUser,
      msg: 'Client Created successfully',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

/**
 * Update Client data with client id and input in json body
 * @param {id: 'client unique id (_id)'} req.param
 * @param {name: '', website: ''} req.body
 * @returns {object} client latest updated object
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { vimeoFolderName } = req.body;

    const client = await Client.findById(id).lean();
    if (!client) {
      return res.status(404).json({ msg: 'Client not found!' });
    }

    let createFolderRes;
    if (client?.vimeoFolderId) {
      if (client?.vimeoFolderName !== vimeoFolderName) {
        const updateFolderRes = await Vimeo.updateFolder({
          name: vimeoFolderName,
          vimeoFolderId: client?.vimeoFolderId,
        });
        if (!updateFolderRes) {
          return res
            .status(500)
            .json({ msg: "Unable to update client's vimeo folder name!" });
        }
      }
    } else if (!id) {
      createFolderRes = await Vimeo.createFolder({
        name: vimeoFolderName,
      });
      if (!createFolderRes) {
        return res
          .status(500)
          .json({ msg: "Unable to create client's folder on vimeo" });
      }
    }

    const responseData = createFolderRes
      ? {
          ...req.body,
          vimeoFolderId: createFolderRes.uri.split('/').pop(),
          vimeoFolderName,
        }
      : { ...req.body };
    const newClient = await Client.findByIdAndUpdate(
      id,
      {
        $set: responseData,
      },
      { new: true }
    );
    if (!newClient) {
      return res.status(404).json({ msg: 'Unable To Update Client' });
    }

    return res
      .status(200)
      .json({ msg: 'Client Updated successfully!', newClient });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

/**
 * Get All Clients
 * @param {sortBy:('field name', sortOrder: 'ASC/DESC')} req.query
 * @returns {object} return clients data
 */
const getAll = async (req, res) => {
  try {
    const {
      prefix,
      page = 1,
      pageSize,
      sortBy = '',
      sortOrder = '',
    } = req.query;

    const sortObject = {
      ...(sortBy
        ? { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
        : { updatedAt: -1, createdAt: -1 }),
    };
    const query = {
      ...(prefix && { name: new RegExp(`^${prefix}`, 'i') }),
    };
    const allClients = await Client.find(query)
      .sort(sortObject)
      .limit(pageSize * 1)
      .skip(pageSize * (page - 1))
      .lean();
    const totalCount = await Client.countDocuments(query);

    return res.status(200).json({
      count: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      allClients: allClients,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

/**
 * This Function will return data depends upon id provided in query params
 * @param {id: '(_id)'} req.params
 * @returns {object} return client object
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id).lean();
    if (!client) {
      return res.status(404).json({ msg: 'No Client found!' });
    }

    return res.status(200).json(client);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const getByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const client = await User.find(
      { 'clients.clientId': clientId },
      { username: 1, email: 1, firstName: 1, lastName: 1, status: 1, roles: 1 }
    ).lean();
    if (!client) {
      return res.status(404).json({ msg: 'No Client found!' });
    }

    return res.status(200).json(client);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

/**
 * Delete a client on the base of id
 * @param {id: (_id)} req.params
 * @returns {object} return success message
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).send({ msg: 'Client not found' });
    }

    return res.status(200).json({ msg: 'Client Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const valid = mongoose.isValidObjectId(id);
    if (!id || id <= 0 || !valid)
      return res.status(400).send({ msg: 'Invalid Id' });

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).send({ msg: 'Client Not Found!' });
    }

    await Client.updateOne({ _id: id }, { status: !client.status });

    return res.status(200).send({ status: !client.status });
  } catch (err) {
    return res.status(410).json({ msg: err.message });
  }
};

const getAllClientNameId = async (req, res) => {
  try {
    const allClients = await Client.find({}, '_id name').lean();

    return res.status(200).json({
      allClients: allClients,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  add,
  getAll,
  remove,
  getById,
  update,
  updateStatus,
  getByClientId,
  getAllClientNameId,
};
