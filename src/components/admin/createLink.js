import { useState } from "react";
import { addLink as addLinkService } from "../../api/link";

export default function CreateLink() {

  const [type, setType] = useState('Default');
  const [name, setName] = useState('');
  const [isParent, setIsParent] = useState(false);
  const [url, setUrl] = useState('');

  const addLink = async () => {
    const result = await addLinkService({
      type,
      name,
      url,
      isParent
    });

    console.log(result);
  };

  return (
    <div>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option>Default</option>
        <option>Google</option>
        <option>Word Document</option>
      </select>


      Name
      <input onChange={e => setName(e.target.value)}></input>
      <br></br>
      Link URL
      <input onChange={e => setUrl(e.target.value)}></input>
      Is Folder?
      <input type="checkbox" onChange={e => setIsParent(e.target.checked)}></input>
      <br></br>
      <button onClick={addLink}>Create Link</button>
    </div>
  );
};
