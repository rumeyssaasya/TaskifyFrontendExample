import { useNavigate } from "react-router-dom";
function Navbar() {
  const MyButton = () => {
  const navigate = useNavigate();
  return (
    <div>
        <button type="button" onClick={navigate={}}>ProjeLerim</button>
        <button>Görevlerim</button>
        <button>Profil</button>
    </div>  )
}

export default Navbar
