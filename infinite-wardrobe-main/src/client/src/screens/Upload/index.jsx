import React from 'react'
import * as Components from "../../components"

function Upload() {
  return (
    <Components.SafeContainer>
      <Components.WebcamCapture/>
    </Components.SafeContainer>
  )
}

export default Upload