import { pool, commonQueries } from '../../database';
import cache from '../../cache';
import { appLimits } from '../../config';
import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

type ImportRow = {
  name?: string,
  description?: string,
  status?: string,
  folder?: string;
  url?: string,
  isKeyTask?: boolean;
  tagsArray: string[];
};

type TaskInsertValue = [
  string,  // name
  string,  // description
  string,  // status
  number,  // folderId
  string,  // url
  number,  // isKeyTask
  number,  // creatorUserId
  number,  // updaterUserId
  string | null // timestamp
];

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    importRows = []
  } = req.body;

  const { engagementId } = req;
  const creatorUserId = req.userId;
  const { orgId } = req;

  if (!engagementId || importRows.length === 0) {
    return res.json({
      message: 'Missing import parameters.'
    });
  }

  const connection = await pool.getConnection();

  await connection.beginTransaction();

  try {
    const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, orgId);

    let orgTaskCount = -1;

    if (orgOwnerPlan === 'free') {
      orgTaskCount = await commonQueries.getOrgTaskCount(connection, orgId);

      if (orgTaskCount === -1) {
        return res.json({ message: `Could not get task count for orgId ${orgId}` });
      }

      if (orgTaskCount >= appLimits.freePlanTasks) {
        await connection.rollback();
        connection.release();
        return res.json({
          message: `Task limit of ${appLimits.freePlanTasks} has been reached.  Upgrade now for unlimited tasks.`
        });
      } else if (orgTaskCount + importRows.length > appLimits.freePlanTasks) {
        await connection.rollback();
        connection.release();
        return res.json({
          message: `Cannot import - task limit of ${appLimits.freePlanTasks} will be exceeded.  Upgrade now for unlimited tasks.`
        });
      }
    }

    const [existingFolders] = await connection.query<RowDataPacket[]>(
      `SELECT id, name FROM folders WHERE engagement_id = ?`,
      [engagementId]
    );

    const [existingTags] = await connection.query<RowDataPacket[]>(
      `SELECT id, name FROM tags WHERE engagement_id = ?`,
      [engagementId]
    );

    const folderNameToIdMap: { [key: string]: number; } = {};
    const tagNameToIdMap: { [key: string]: number; } = {};

    existingFolders.forEach(({ name, id }) => folderNameToIdMap[name] = id);
    existingTags.forEach(({ name, id }) => tagNameToIdMap[name] = id);

    const newFoldersSet: Set<string> = new Set();
    const newTagsSet: Set<string> = new Set();

    importRows.forEach((row: ImportRow) => {
      const {
        name,
        folder,
        tagsArray = [],
      } = row;

      if (name && folder) {
        if (!folderNameToIdMap[folder]) {
          newFoldersSet.add(folder);
        }

        tagsArray.forEach(tag => {
          if (!tagNameToIdMap[tag]) {
            newTagsSet.add(tag);
          }
        });
      }
    });

    const foldersArray = [...newFoldersSet];
    const tagsArray: string[] = [...newTagsSet];

    const folderInsertVals = foldersArray.map(folder => [folder, engagementId]);
    const tagsInsertVals = tagsArray.map(tag => [tag, engagementId]);

    if (folderInsertVals.length > 0) {
      const insertResult = await connection.query<ResultSetHeader>(
        `INSERT INTO folders (name, engagement_id) VALUES ?`,
        [folderInsertVals]
      );

      let insertId = insertResult[0].insertId;
      foldersArray.forEach(folder => folderNameToIdMap[folder] = insertId++);
    }

    if (tagsInsertVals.length > 0) {
      const insertResult = await connection.query<ResultSetHeader>(
        `INSERT INTO tags (name, engagement_id) VALUES ?`,
        [tagsInsertVals]
      );

      let insertId = insertResult[0].insertId;
      tagsArray.forEach(tag => tagNameToIdMap[tag] = insertId++);
    }

    const taskInsertVals: TaskInsertValue[] = [];

    importRows.forEach((row: ImportRow) => {
      const {
        name,
        description = '',
        status,
        folder,
        url = '',
        isKeyTask = false
      } = row;

      if (name && folder) {
        taskInsertVals.push([
          name,
          description,
          status || 'New',
          folderNameToIdMap[folder],
          url,
          Number(isKeyTask),
          creatorUserId,
          creatorUserId,
          status === 'Complete' ? 'CURRENT_TIMESTAMP' : null
        ]);
      }
    });

    const insertResult = await connection.query<ResultSetHeader>(
      `INSERT INTO tasks (name, description, status, folder_id, link_url, is_key_task, created_by_id, last_updated_by_id, date_completed)
       VALUES ?`,
      [taskInsertVals]
    );

    let insertId = insertResult[0].insertId;

    let taskTagsInsertVals: number[][] = [];

    importRows.forEach((row: ImportRow) => {
      const {
        tagsArray = []
      } = row;

      const taskId = insertId;

      tagsArray.forEach(tag => {
        taskTagsInsertVals.push([taskId, tagNameToIdMap[tag]]);
      });

      insertId++;
    });

    if (taskTagsInsertVals.length) {
      await connection.query(
        `INSERT INTO task_tags (task_id, tag_id) VALUES ?`,
        [taskTagsInsertVals]
      );
    }

    if (orgOwnerPlan === 'free') {
      cache.set(`org-${orgId}`, { ...cache.get(`org-${orgId}`), taskCount: orgTaskCount + taskInsertVals.length });
    }

    await connection.commit();

    connection.release();

    return res.json({
      success: true
    });

  } catch (error) {
    await connection.rollback();

    connection.release();
    next(error);
  }
};