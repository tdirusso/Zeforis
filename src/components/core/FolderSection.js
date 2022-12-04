import AddFolder from "../admin/AddFolder";
import { Link } from "react-router-dom";

export default function FolderSection({ folderId, folder, clientId, clientName }) {

  return (
    <div>
      <AddFolder
        parentFolderId={folderId}
        clientId={clientId} />
      <Link
        to={`folders/${folder.name}`}
        state={{ clientId, clientName }}>
        {folder.name}
      </Link>
    </div>
  )
};
