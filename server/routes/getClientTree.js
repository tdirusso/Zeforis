const Folder = require('../../models/folder');
const Link = require('../../models/link');

module.exports = async (req, res) => {

  const { clientId } = req.query;

  if (!clientId) {
    return res.json({
      message: 'No clientId provided.'
    });
  }

  try {
    const folders = await Folder.find({ clientId }).lean();
    const folderIds = folders.map(folder => folder._id.toString());

    const links = await Link.find({ folderId: { $in: folderIds } }).lean();

    const folderToLinksMap = { root: [] };

    links.forEach(link => {
      const parentFolderId = link.parentFolderId;

      if (!parentFolderId) {
        folderToLinksMap.root.push(link);
      } else {
        if (folderToLinksMap[parentFolderId]) {
          folderToLinksMap[parentFolderId].push(link);
        } else {
          folderToLinksMap[parentFolderId] = [link];
        }
      }
    });

    const foldersMap = new Map(folders.map(folder => [folder._id.toString(), folder]));

    const clientTree = {};
    
    folders.forEach(folder => {
      const parentFolderId = folder.parentFolderId;

      if (folder.parentFolderId) {
        folder.links = folderToLinksMap[parentFolderId] || [];

        const parentFolder = foldersMap.get(folder.parentFolderId);

        if (parentFolder) {
          const childFolders = parentFolder.folders;

          if (childFolders) {
            parentFolder.folders.push(folder);
          } else {
            parentFolder.folders = [folder];
          }
        }
      } else {
        folder.links = folderToLinksMap.root;
        clientTree.root = folder;
      }
    });

    return res.json({ clientTree });

  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};