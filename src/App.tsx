import React, {useEffect} from 'react';
import {Editor} from './layout/Editor'

function App() {

  const props = {
    width: 1000,
    height: 500,
    responsive: false,
    aspectRatio: 1,
  }
  return <Editor {...props} />
}

export default App;
