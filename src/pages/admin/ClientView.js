/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getClient as getClientService } from "../../api/client";

export default function ClientView() {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');

  const locationData = useLocation();
  const navigate = useNavigate();
  const clientId = locationData.state.clientId;

  if (!clientId) {
    navigate('/admin');
  }

  useEffect(() => {
    async function getClient() {
      const result = await getClientService(clientId);

      console.log(result);
      if (result.client) {
        setClient(result.client);
      } else {
        setError(result.message);
      }

      setLoading(false);
    }

    getClient();
  }, []);

  return (
    <div>
      {
        loading ? <div>loading...</div> :
          <div>
            {client.name}
          </div>
      }
    </div>
  );
};
