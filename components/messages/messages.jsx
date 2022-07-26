import React from "react";
import styles from "./messages.module.css"

export const Messages = ({msgs, socket}) => {
  return (
  <>
    <div id="msg-container" className={styles["msg-container"]}>
      {msgs.map((msg,i) => {
        return (<div key={i} className={[styles.message, msg.id === socket.id? styles.right : styles.left].join(' ')}>
          <p className={styles.header}><i>{new Date(msg.timestamp).toLocaleTimeString()}</i> - <b>{msg.name}:</b></p>
          <p className={styles.text}>{msg.msg}</p>
        </div>)
      })}
    </div>
  </>
  )
};
