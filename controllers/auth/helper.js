const { Album } = require('../../models/Album');
const { AlbumShot } = require('../../models/AlbumShot');
const Client = require('../../models/Client');
const VideoDraft = require('../../models/Draft');
const LibraryMedia = require('../../models/LibraryMedia');
const Project = require('../../models/Project');
const User = require('../../models/User');
const { VideoProject } = require('../../models/VideoProject');
const { VideoRequests } = require('../../models/VideoRequests');
const { VideoRequestThemes } = require('../../models/VideoRequestThemes');
const Widget = require('../../models/Widget');
const { ObjectId } = require('../../utils/helper');
const demoSchoolData = require('./data');

exports.VideoProjectDataDelete = async ({ clientId }) => {
  try {
    const videoProjectIds = await VideoProject?.find({ clientId })
      .select('_id')
      .lean();
    const videoProjectIdArray = videoProjectIds?.map((vp) => vp._id);
    const albums = await Album.find({ clientId }).select('_id').lean();
    const albumIdsList = albums?.map((album) => album._id);

    await Promise.all([
      Album.deleteMany({ clientId }),
      AlbumShot.deleteMany({ album: { $in: albumIdsList } }),
      VideoDraft.deleteMany({ videoProjectId: { $in: videoProjectIdArray } }),
      VideoProject.deleteMany({ clientId }),
      Project.deleteMany({ clientId }),
      Widget.deleteMany({ clientId }),
      LibraryMedia.deleteMany({ clientId }),
      VideoRequests.deleteMany({ clientId }),
      VideoRequestThemes.deleteMany({ clientId }),
    ]);

    const users = await User.find({ 'clientId.clientId': clientId });
    await Promise.all(
      users.map(async (user) => {
        user.clientId = user.clientId.filter(
          (client) => !client.clientId.equals(clientId)
        );
        if (user.clientId.length === 0) {
          await User.findByIdAndDelete(user._id);
        } else {
          await user.save();
        }
      })
    );

    const {
      users: newUsers,
      videoProjects: newVideoProjects,
      albums: newAlbums,
      albumShots: newAlbumShots,
      videoRequestTheme: newVideoRequestThemes,
      videoRequest: newVideoRequests,
      widgetData: newWidgetData,
      libraryMedia: libraryMedia,
      projectMedia: projectMedia,
    } = demoSchoolData;

    const insertData = [
      { data: newUsers, model: User, name: 'users' },
      { data: newVideoProjects, model: VideoProject, name: 'video projects' },
      { data: newAlbums, model: Album, name: 'albums' },
      { data: newAlbumShots, model: AlbumShot, name: 'album shots' },
      {
        data: newVideoRequestThemes,
        model: VideoRequestThemes,
        name: 'VideoRequestThemes',
      },
      { data: newVideoRequests, model: VideoRequests, name: 'VideoRequests' },
      { data: newWidgetData, model: Widget, name: 'widgets' },
      { data: libraryMedia, model: LibraryMedia, name: 'Library Media' },
      { data: projectMedia, model: Project, name: 'Project Media' },
    ];

    await Promise.all(
      insertData?.map(async ({ data, model, name }) => {
        if (data && data.length > 0) {
          await model.insertMany(data);
          //   console.log(`Inserted ${name}:`, res);
        }
      })
    );

    return { msg: 'Data successfully restore' };
  } catch (err) {
    console.error(err);
    return { msg: 'Server Error' };
  }
};

exports.handleAllClientRolesFun = async () => {
  try {
    const allClients = await Client.find({});

    const clientRoles = allClients.map((client) => ({
      clientId: client,
      role: 'backend',
    }));

    return clientRoles;
  } catch (error) {
    console.error('Error in handleAllClientRolesFun:', error);
    return [];
  }
};
