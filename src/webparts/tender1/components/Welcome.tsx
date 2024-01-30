import * as React from "react";
import "./welcome.css";
// import { FileUpload } from "primereact/fileupload";

const Welcome: React.FC = () => {
  const handleChange = (event: any) => {
    let item = event.target.files;
    console.log(item);
  };

  return (
    <div>
      <h1> WelCome </h1>
      <div className="borderInput">
        <input multiple type="file" onChange={handleChange} />
      </div>
    </div>
  );
};
export default Welcome;
