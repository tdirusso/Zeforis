import { Link } from "react-router-dom";
import ClientList from "../../components/admin/ClientMenu";

export default function Dashboard() {
  return (
    <div>
      <ClientList />
      <br></br>
      <Link to="addClient" ><button>Add Client</button></Link>
    </div>
  )
};
