import { useState } from "react";
import { addClient as addClientService } from "../../api/client";
import { BlockPicker } from 'react-color'

export default function AddClient() {

  const [name, setName] = useState('');
  const [brandColor, setBrandColor] = useState('#2ccce4');

  const addClient = async () => {
    const result = await addClientService({
      name,
      brandColor
    });

    console.log(result);
  };

  return (
    <div>
      Name
      <input onChange={e => setName(e.target.value)}></input>
      <br></br>
      Brand Color
      <BlockPicker color={brandColor} onChange={color => setBrandColor(color.hex)} />
      <button onClick={addClient}>Create Client</button>
    </div>
  );
};
