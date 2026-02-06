import React from 'react'

const Version = () => {
  return (
       <div style={styles.version}>
  App Version 1.0.2
</div>
  )
}

export default Version

const styles = {
 
  version: {
    textAlign: "center",
    backgroundColor: "white",
    // marginTop: "30px",
    fontSize: "12px",
    width: "100%",
    color: "#9ca3af",
  },
};