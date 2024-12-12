const { axiosApiRequest } = require('./api');
const { callWithTimeout } = require('./helper');

const Vimeo = {};

const user_id = process.env.VIMEO_USER_ID;
const configs = {
  headers: {
    Authorization: `Bearer ${process.env.VIMEO_TOKEN}`,
  },
};

Vimeo.createFolder = async ({ name }) => {
  const res = await axiosApiRequest({
    method: 'post',
    url: `https://api.vimeo.com/users/${user_id}/projects`,
    data: { name },
    params: {
      fields: 'name,uri',
    },
    ...configs,
  });
  if (res.status === 201) {
    return res.data;
  }
};

Vimeo.updateFolder = async ({ vimeoFolderId, name }) => {
  const res = await axiosApiRequest({
    method: 'patch',
    url: `https://api.vimeo.com/users/${user_id}/projects/${vimeoFolderId}`,
    data: { name },
    params: {
      fields: 'name,uri',
    },
    ...configs,
  });
  if (res.status === 200) {
    return res.data;
  }
};

Vimeo.getVideo = async ({ id }) => {
  const res = await axiosApiRequest({
    method: 'get',
    url: `https://api.vimeo.com/videos/${id}`,
    ...configs,
    // params: {
    //   fields: 'name,description,duration,link,pictures.base_link,download',
    // },
  });
  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error('Unable to fetch vimeo video!');
  }
};

Vimeo.getVideoModifiedDate = async ({ id }) => {
  const res = await axiosApiRequest({
    method: 'get',
    url: `https://api.vimeo.com/videos/${id}`,
    ...configs,
    params: {
      fields: 'name,duration,modified_time',
    },
  });
  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error('Unable to fetch vimeo video!');
  }
};

Vimeo.isVideoAvailable = async ({ id }) => {
  const res = await axiosApiRequest({
    method: 'get',
    url: `https://api.vimeo.com/videos/${id}`,
    params: { fields: 'status,pictures.base_link' },
    ...configs,
  });
  console.info(
    `${id} is: ${res.data.status} and imageUrl is: ${
      res?.data?.pictures?.base_link !==
        'https://i.vimeocdn.com/video/default' &&
      !res?.data?.pictures?.baseLink?.split('/')?.pop()?.includes('default')
        ? 'updated'
        : 'not updated'
    }`
  );
  if (res.status === 200 && res.data.status === 'available') {
    return { completed: true };
  } else if (res.status === 404) {
    return { abort: true, response: res.data.error };
  }
};

Vimeo.createThumbnail = async ({ id, duration, time }) => {
  const res = await axiosApiRequest({
    method: 'post',
    url: `https://api.vimeo.com/videos/${id}/pictures`,
    params: { fields: 'base_link' },
    ...configs,
    data: {
      time: time || Math.round(duration / 2),
      active: true,
    },
  });
  if (res.status === 201) {
    return res.data.base_link;
  }
};

Vimeo.setUnlistedVimeoVideo = async ({ id }) => {
  try {
    const res = await axiosApiRequest({
      method: 'patch',
      url: `https://api.vimeo.com/videos/${id}`,
      ...configs,
      data: {
        privacy: {
          view: 'unlisted',
        },
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`Unexpected response status: ${res.status}`);
    }
  } catch (error) {
    throw error;
  }
};

Vimeo.moveVideoToAFolder = async ({ folderId, videoId }) => {
  await axiosApiRequest({
    method: 'put',
    url: `https://api.vimeo.com/users/${user_id}/projects/${folderId}/videos/${videoId}`,
    ...configs,
  });
};

Vimeo.getSingleVideoData = async ({ assetId }) => {
  await callWithTimeout({
    params: { id: assetId },
    interval: 10 * 1000,
    fn: Vimeo.isVideoAvailable,
  });

  const {
    duration,
    download,
    pictures: { base_link },
    player_embed_url,
    link,
    user,
  } = await Vimeo.getVideo({ id: assetId });

  return {
    duration,
    base_link,
    player_embed_url,
    link,
    user,
    downloads: download
      ?.map(({ rendition, link }) => ({ quality: rendition, link }))
      ?.sort((a, b) => a?.rendition - b?.rendition),
  };
};

Vimeo.deleteVimeoVideo = async ({ id }) => {
  try {
    const res = await axiosApiRequest({
      method: 'delete',
      url: `https://api.vimeo.com/videos/${id}`,
      ...configs,
    });

    if (res.status === 204) {
      return { message: `Video with ID ${id} deleted successfully.` };
    } else {
      throw new Error(`Unexpected response status: ${res.status}`);
    }
  } catch (error) {
    throw error;
  }
};

Vimeo.updateVimeoVideoName = async ({ id, newName }) => {
  try {
    const res = await axiosApiRequest({
      method: 'patch',
      url: `https://api.vimeo.com/videos/${id}`,
      ...configs,
      data: {
        name: newName,
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`Unexpected response status: ${res.status}`);
    }
  } catch (error) {
    throw error;
  }
};

// Vimeo.replaceVimeoVideo = async ({ id, newVideoFilePath }) => {
//   try {
//     // Step 1: Request an upload link for the existing video
//     const res = await axiosApiRequest({
//       method: 'patch',
//       url: `https://api.vimeo.com/videos/${id}`,
//       data: {
//         upload: {
//           approach: 'tus',
//           size: newVideoFilePath.size, // Get the file size for the upload
//         },
//       },
//       ...configs,
//     });

//     const uploadLink = res.data.upload.upload_link;
//     if (!uploadLink) {
//       throw new Error('Failed to get an upload link from Vimeo.');
//     }

//     // Step 2: Upload the new video content to the provided upload link
//     const fileStream = fs.createReadStream(newVideoFilePath);
//     const uploadResponse = await axios.patch(uploadLink, fileStream, {
//       headers: {
//         'Content-Type': 'application/offset+octet-stream',
//         'Upload-Offset': 0,
//       },
//       maxContentLength: Infinity,
//       maxBodyLength: Infinity,
//     });

//     if (uploadResponse.status === 204) {
//       return { message: `Video with ID ${id} replaced successfully.` };
//     } else {
//       throw new Error(`Unexpected response status: ${uploadResponse.status}`);
//     }
//   } catch (error) {
//     throw error;
//   }
// };

exports.Vimeo = Vimeo;
