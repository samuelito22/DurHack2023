import React from 'react'
import Webcam from "react-webcam"
import uploadPicture from '../../services/uploadPicture';
import RedButton from "../../assets/rec.png"
import Replace from "../../assets/replace.png"
import styles from "./styles.module.css"

function WebcamCapture() {
    const FACING_MODE_USER = "user";
    const FACING_MODE_ENVIRONMENT = "environment";
    const webcamRef = React.useRef(null)
    
    const videoConstraints = {
      facingMode: FACING_MODE_USER
    };
    
      const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);
    
      const handleSwitch = React.useCallback(() => {
        setFacingMode(
          prevState =>
            prevState === FACING_MODE_USER
              ? FACING_MODE_ENVIRONMENT
              : FACING_MODE_USER
        );
      }, []);

      const handleCapture = React.useCallback(
        async () => {
          const imageSrc = webcamRef.current.getScreenshot();
          uploadPicture(imageSrc).then(() => {
            alert("Picture uploaded successfully!")
          }).catch((err) => {
            alert("Picture upload failed!")
            console.error(err)
          });
        },
        [webcamRef]
      );
    
      return (
        <>
          <div className={styles.icons_container}>
            <img onClick={handleCapture} src={RedButton} className={styles.icon}/>
            <img onClick={handleSwitch}  src={Replace} className={styles.icon}/>
          </div>
          <Webcam
          ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              ...videoConstraints,
              facingMode
            }}
          />
        </>
      );
    };


export default WebcamCapture