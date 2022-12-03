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

    const tree = {};

    const rootFolder = folders.find(folder => folder.name === 'root');


    function toTree(arr) {
      let arrMap = new Map(arr.map(item => [item.id, item]));
      let tree = [];

      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];

        if (item.pid) {
          let parentItem = arrMap.get(item.pid);

          if (parentItem) {
            let { children } = parentItem;

            if (children) {
              parentItem.children.push(item);
            } else {
              parentItem.children = [item];
            }
          }
        } else {
          tree.push(item);
        }
      }

      return tree;
    }


    return res.json({ folders, links });

  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};