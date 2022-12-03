/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getClientTree as getClientTreeService } from "../../api/client";

export default function ClientView() {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');

  const locationData = useLocation();
  const { clientId } = locationData.state;

  const navigate = useNavigate();

  if (!clientId) {
    navigate('/admin');
  }

  useEffect(() => {
    async function getClientTree() {
      const result = await getClientTreeService(clientId);

      console.log(result);
      if (result.client) {
        setClient(result.client);
      } else {
        setError(result.message);
      }

      setLoading(false);
    }

    getClientTree();
  }, []);

  return (
    <div>
      {
        loading ? <div>loading...</div> :
          <div>
            {clientId}
          </div>
      }
    </div>
  );
};
