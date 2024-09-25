import { forwardRef, useRef, useState } from "react";
import styles from "../index.module.css";
import StylingInput from "./StylingInput";

const BackgroundImageInput = ({ label = "Background Image", value = "", onChange, readOnly = false }) => {
  const [imageSource, setImageSource] = useState(value);
  const [fileUploaded, setFileUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setImageSource(imageUrl);
        setFileUploaded(true);
        onChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url) => {
    setImageSource(url);
    setFileUploaded(false);
    onChange(url);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearImage = () => {
    setImageSource("");
    setFileUploaded(false);
    onChange("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles["styling-field"]}>
      <span>{label}</span>
      <div className={styles["styling-inputs"]}>
        <StylingInput
          type="text"
          value={imageSource}
          onChange={handleUrlChange}
          placeholder="Paste image URL"
          className="url-input"
          readOnly={readOnly}
          disabled={fileUploaded}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={"file-input"}
          readOnly={readOnly}
          ref={fileInputRef}
        />

        {imageSource && (
          <button onClick={handleClearImage} className={styles["clear-button"]}>
            Clear Background
          </button>
        )}
      </div>
    </div>
  );
};

export default BackgroundImageInput;
