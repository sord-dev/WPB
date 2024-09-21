import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

const SystemNotificationPopUp = ({ message, timeout = 1500, onClose }) => {
    const [isVisible, setIsVisible] = useState(message ? true : false);

    useEffect(() => {
        setIsVisible(message ? true : false);
    }, [message])

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, timeout);
  
      return () => clearTimeout(timeoutId);
    }, [timeout, onClose]);
  
    const notificationStyles = {
        opacity: isVisible ? 1 : 0,
      };
  
    return (
      <div className={styles["notification"]} style={notificationStyles}>
        {message}
      </div>
    );
  };
export default SystemNotificationPopUp