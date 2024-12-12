const axios = require('axios');

exports.axiosApiRequest = async (configs) => {
  try {
    const res = await axios({
      ...configs,
    });
    return res;
  } catch (error) {
    console.error(error);
    return error.response;
  }
};
