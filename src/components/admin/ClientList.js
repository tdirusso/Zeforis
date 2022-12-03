import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { getAllClients } from "../../api/client";

export default function ClientList() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
 
    async function getClients() {
      try {
        const { clients, message } = await getAllClients();

        if (clients) {
          setClients(clients);
        } else {
          setError(message);
        }
        setLoading(false);
      } catch (er) {
        console.log(er)
      }
    }

    getClients();
  }, [])

  return (
    <div>
      {
        loading ? <div>Loading...</div> : clients.map(client => {
          return (
            <div key={client._id}>
              <Link
                to={`client/${client.name}`}
                state={{ clientId: client._id }}>
                {client.name}
              </Link>
            </div>
          );
        })
      }
    </div>
  )
};
