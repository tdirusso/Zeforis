import { Link } from "react-router-dom";
import ClientList from "../../components/admin/ClientList";

export default function AdminMain() {
  return (
    <div>
      <ClientList />
      <br></br>
      <Link to="addClient" ><button>Add Client</button></Link>
    </div>
  )
};
