const { ObjectId } = require('../../utils/helper');

const { Vimeo } = require('../../utils/vimeo');

const LibraryMedia = require('../../models/LibraryMedia');

const isDateEqual = (date1, date2) => {
  return new Date(date1).getTime() === new Date(date2).getTime();
};

const handleUpdateThumbnailReplace = async ({ clientId }) => {
  try {
    const getAllLibrary = await LibraryMedia.find({
      clientId: ObjectId(clientId),
    });
    //
    const results = await Promise.all(
      getAllLibrary?.map(async (libraryData) => {
        const { assetId, _id, currentModifyDate } = libraryData;
        const assetDetails = await Vimeo.getVideoModifiedDate({ id: assetId });

        if (
          !assetDetails ||
          isDateEqual(assetDetails.modified_time, currentModifyDate)
        ) {
          return { assetId, updated: false, skipped: true };
        }

        const halfDuration = assetDetails.duration / 2;
        const thumbnail = await Vimeo.createThumbnail({
          id: assetId,
          time: halfDuration,
        });
        // check after the upadte again
        const checkVideoAfterUpdate = await Vimeo.getVideoModifiedDate({
          id: assetId,
        });

        const updatedLibrary = await LibraryMedia.findByIdAndUpdate(
          _id,
          {
            thumbnailUrl: thumbnail,
            duration: checkVideoAfterUpdate?.duration,
            currentModifyDate: checkVideoAfterUpdate.modified_time,
          },
          { new: true }
        );
        await LibraryMedia.updateMany(
          { assetId: assetId },
          {
            $set: {
              thumbnailUrl: thumbnail,
              duration: checkVideoAfterUpdate?.duration,
              currentModifyDate: checkVideoAfterUpdate.modified_time,
            },
          }
        );

        return { assetId, updated: !!updatedLibrary, skipped: !updatedLibrary };
      })
    );

    const allProcessed = results.every(
      (result) => result.updated || result.skipped
    );

    if (allProcessed) {
      console.log('All assets processed successfully:');
    } else {
      console.warn('Some assets could not be processed:');
    }

    return allProcessed;
  } catch (error) {
    console.error('Error during thumbnail replacement process:', error);
    return false;
  }
};

module.exports = {
  handleUpdateThumbnailReplace,
};
