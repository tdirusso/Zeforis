
module.exports = async (req, res) => {

  const { clientId } = req.query;

  if (!clientId) {
    return res.json({ message: 'No clientId provided.' });
  }

  try {

    //const folders = await Folder.find({ client: clientId }).lean();
   // const folderIds = folders.map(folder => folder._id.toString());

    // let tasks = await Task.find({ folder: { $in: folderIds } }).lean();

    // const foldersMap = new Map(folders.map(folder => [folder._id.toString(), folder]));

    // tasks = [{ folder: '63a36cf749bb76fc0bdd963e', name: 'task 1' }];

    // tasks.forEach(task => {
    //   const folderId = task.folder.toString();

    //   const folder = foldersMap.get(folderId);

    //   if (folder.tasks) {
    //     folder.tasks.push(task);
    //   } else {
    //     folder.tasks = [task];
    //   }
    // });



    // return res.json({ folders: Array.from(foldersMap, ([name, value]) => value) });

  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};