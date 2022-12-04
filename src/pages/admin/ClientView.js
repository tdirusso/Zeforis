/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Routes, Route, Outlet } from "react-router-dom";
import { getClientTree } from "../../api/client";
import AddFolder from "../../components/admin/AddFolder";
import FolderSection from "../../components/global/FolderSection";

export default function ClientView() {
  const [loading, setLoading] = useState(true);
  const [clientTree, setClientTree] = useState(null);
  const [error, setError] = useState('');

  const locationData = useLocation();
  const { clientId, clientName } = locationData.state;

  const navigate = useNavigate();

  if (!clientId) {
    navigate(-1);
  }

  useEffect(() => {
    async function fetchClientTree() {
      try {
        const result = await getClientTree(clientId);

        console.log(result);
        if (result.clientTree) {
          setClientTree(result.clientTree);
        } else {
          setError(result.message);
        }

        setLoading(false);
      } catch ({ message }) {
        setError(message);
      }
    }

    fetchClientTree();
  }, []);

  const renderTree = (node) => {

    const linkElements = node.links.map(link => {
      return (
        <a key={link._id} href={link.url}>{link.name}</a>
      )
    });

    const folderSections = node.folders.map(folder => {
      return (
        <div key={folder._id}>
          <FolderSection
            folderId={folder._id}
            folder={folder}
            clientId={clientId}
            clientName={clientName}
          />
        </div>
      )
    });

    if (folderSections.length === 0) {
      return (
        <>
          No folders
          <AddFolder parentFolderId={node._id}
            clientId={clientId} />
        </>
      )
    }

    return (
      <div>
        {folderSections}
        <Outlet />
      </div>
    );
  };

  return (
    <div>
      {
        loading ? <div>loading...</div> :
          <div>
            <br></br>
            {clientName}
            <br></br>
            <br></br>
            {
              renderTree(clientTree.root)
            }
          </div>
      }
    </div>
  );
};
