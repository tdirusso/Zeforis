import { logout } from "../../api/auth"

export default function LogoutButton() {

  return (
    <button onClick={logout}>Logout</button>
  )
};
