// Importing Widget Model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User.js');
const Client = require('../../models/Client.js');
const Widget = require('../../models/Widget.js');
const { ObjectId } = require('../../utils/helper');
const { widgetSendEmail } = require('../../utils/emailByPostmark.js');

const config = require('../../config/auth');

const { createVideoProjectAlbum } = require('./create-project-album/index.js');

const {
  sendEmailToUser,
  sendEmailCreateUser,
  sendEmailToAlan,
} = require('./email services/index.js');
const { sendSMSToUser } = require('./send-sms/index.js');
const { getUniqueProjectName } = require('../utils/index.js');

/**
 * Create a new Widget and store it in the MongoDB collection 'Widget'.
 * @param {object} req.body - JSON body with widget details
 * @returns {object} - The created Widget document
 */
const add = async (req, res) => {
  try {
    const newWidget = await Widget.create(req.body);
    return res
      .status(200)
      .json({ msg: 'Widget Created successfully', newWidget });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Update Widget data with the provided id and the new data in the JSON body
 * @param {string} req.params.id - Unique Widget ID (_id)
 * @param {object} req.body - JSON body with the updated widget details
 * @returns {object} - The updated Widget document
 */
const update = async (req, res) => {
  try {
    const updatedWidget = await Widget.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedWidget) {
      return res.status(404).json({ msg: 'Unable To Update Widget' });
    }

    return res
      .status(200)
      .json({ msg: 'Widget Updated successfully!', updatedWidget });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Get all Widgets with optional search and sort parameters
 * @param {string} req.query.search - search term for widget name
 * @param {string} req.query.sortBy - field to sort by
 * @param {string} req.query.sortOrder - sort order (ASC/DESC)
 * @returns {object} - An array of all matching widgets
 */
const getAll = async (req, res) => {
  try {
    const { search, sortBy, sortOrder, clientId } = req.query;
    const sortObject = sortBy
      ? { [sortBy]: sortOrder.toLowerCase() === 'desc' ? -1 : 1 }
      : { updatedAt: -1, createdAt: -1 };

    const allWidgets = await Widget.find({
      clientId: ObjectId(clientId),
      ...(search && { name: new RegExp(search, 'i') }),
    })
      .select('_id name active updatedAt')
      .sort(sortObject)
      .lean();

    return res.status(200).json({
      count: allWidgets.length,
      allWidgets,
    }); //
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

/**
 * Get a widget by its ID
 * @param {string} req.params.id - Unique Widget ID (_id)
 * @returns {object} - The matching Widget document
 */
const getById = async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id)
      .populate('clientId')
      .populate({
        path: 'media._id',
        populate: {
          path: 'userId',
          select: '-__v',
        },
      });
    if (!widget) {
      return res.status(404).json({ msg: 'No Widget found!' });
    }
    return res.status(200).json(widget);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

/**
 * Delete a widget by its ID
 * @param {string} req.params.id - Unique Widget ID (_id)
 * @returns {object} - Success message
 */
const remove = async (req, res) => {
  try {
    const deletedClient = await Widget.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).send({ msg: 'Widget not found' });
    }
    return res.status(200).json({ msg: 'Widget Removed Successfully' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const widgetEmailSend = async (req, res) => {
  try {
    const { email, name, contactNumber, clientId } = req.body;

    const isClientRegister = await Client.findOne({
      _id: clientId,
    });
    if (isClientRegister) {
      const isUser = await User.findOne({
        $or: [{ email: email }, { contactNumber: contactNumber }],
      });

      if (isUser) {
        if (
          isUser?.email !== email &&
          isUser?.contactNumber === contactNumber
        ) {
          return res.status(500).send({ msg: 'Phone number already exists' });
        }
        if (
          isUser?.email === email &&
          isUser?.contactNumber !== contactNumber
        ) {
          return res.status(500).send({ msg: 'Email already exists' });
        }
        if (isUser.clientId) {
          const isClientExist = isUser.clientId?.some((client) => {
            return (
              client?.clientId &&
              clientId?._id &&
              new ObjectId(client.clientId).equals(new ObjectId(clientId._id))
            );
          });
          if (!isClientExist) {
            isUser.clientId.push({ clientId, role: 'producer' });
            await isUser.save();
          }
        }

        const videoProjectName = await getUniqueProjectName({
          clientId: isClientRegister?._id,
        });
        const response = await createVideoProjectAlbum({
          clientId: isClientRegister?._id,
          videoProjectName: videoProjectName,
          userName: isUser?.username || isUser?.fullName,
          userId: isUser?._id,
        });

        const tokenData = {
          userId: isUser?._id,
          clientId: isUser?.clientId,
          videoProjectId: response?.newVideoProject?._id,
          roles: isUser?.roles,
          selectedClientId: isClientRegister?._id,
        };
        const token = jwt.sign({ ...tokenData }, config.secret, {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
        });

        const emailFormateResult = sendEmailToUser({
          videoProjectName: response?.newVideoProject?.name,
          userName: isUser?.username || isUser?.fullName,
          email: isUser?.email,
          token,
          contactNumber: isUser?.contactNumber,
        });

        const result = await widgetSendEmail(emailFormateResult);
        if (isUser?.isAllowContact) {
          await sendSMSToUser({
            token,
            videoProjectName: response?.newVideoProject?.name,
            contactNumber: contactNumber || isUser?.contactNumber,
          });
        }

        if (result.success === false) {
          return res.status(500).send({
            msg: `'Project successfully but  User Email is '${result.error}  `,
            result,
          });
        } else {
          return res.status(200).send({
            msg: 'Email sent Successfully',
            result,
          });
        }
      } else if (!isUser) {
        const isUserEmail = await User.findOne({ email: email });
        if (isUserEmail?.email === email) {
          res.status(500).send({ msg: 'Email already exists' });
        }

        const isUserConatctNumber = await User.findOne({
          contactNumber: contactNumber,
        });
        if (isUserConatctNumber?.contactNumber === contactNumber) {
          res.status(500).send({ msg: 'Phone number already exists' });
        }

        const data = {
          name,
          email: email,
          fullName: name,
          username: name,
          password: name,
          contactNumber: contactNumber,
        };

        const newData = {
          ...data,
          isAllowContact: true,
          roles: ['producer'],
          contactNumber: contactNumber,
          clientId: [{ clientId: isClientRegister?._id, role: 'producer' }],
        };
        const createUser = await User.create({
          ...newData,
          password: bcrypt.hashSync(data?.password, 8),
        });
        if (res.status(200)) {
          const videoProjectName = await getUniqueProjectName({
            clientId: isClientRegister?._id,
          });
          const response = await createVideoProjectAlbum({
            clientId: isClientRegister?._id,
            videoProjectName: videoProjectName,
            userName: createUser?.username || createUser?.fullName,
            userId: createUser?._id,
          });

          const tokenData = {
            userId: createUser?._id,
            videoProjectId: response?.newVideoProject?._id,
            roles: createUser?.roles,
            clientId: createUser?.clientId,
            selectedClientId: isClientRegister?._id,
          };
          const token = jwt.sign({ ...tokenData }, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
          });
          if (createUser?.email) {
            const emailFormateResult = sendEmailCreateUser({
              videoProjectName,
              email: createUser?.email,
              token,
            });
            if (createUser && createUser?.isAllowContact) {
              await sendSMSToUser({
                token: token,
                videoProjectName: videoProjectName,
                contactNumber: contactNumber || createUser?.contactNumber,
              });
            }
            const sendMailToAlan = sendEmailToAlan({
              videoProjectName,
              email: createUser?.email,
              clientName: isClientRegister?.name,
              contactNumber: createUser?.contactNumber,
            });

            await widgetSendEmail(sendMailToAlan);
            const result = await widgetSendEmail(emailFormateResult);
            if (result.success === false) {
              return res.status(500).send({
                msg: `Error ${result?.error}`,
                result,
              });
            } else {
              return res.status(200).send({
                msg: 'Email sent Successfully',
                result,
              });
            }
          }
        }
      }
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

// Exporting the functions
module.exports = { add, getAll, remove, getById, update, widgetEmailSend };
