import { useState } from "react";
import { addFolder as addFolderService } from "../../api/folder";

export default function AddFolder() {

  const [name, setName] = useState('');

  const addFolder = async () => {
    const result = await addFolderService({
      name
    }); 
 
    console.log(result);
  };

  return (
    <div>
      Name
      <input onChange={e => setName(e.target.value)}></input>
      <br></br>
      <button onClick={addFolder}>Create Folder</button>
    </div>
  );
};
