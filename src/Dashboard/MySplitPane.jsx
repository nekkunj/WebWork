import SplitPane from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css'
import React, { useRef, useState,useEffect } from 'react';
 

function MySplitPane({children,column1Size} ) {
    const [sizes, setSizes] = useState(['60%', '40%']);

    const handleSizeChange = (newSizes) => {
        if (newSizes[0] < '300') {
            newSizes[0] = '30%';
            newSizes[1] = '70%';
          }
          if (newSizes[1] < '300') {
            newSizes[0] = '70%';
            newSizes[1] = '30%';
          }
        setSizes(newSizes);

          document.getElementById('overlay').style.pointerEvents = 'none'
          document.getElementById('content').style.pointerEvents = 'none'

          
    };
    const handleDragFinish=()=>{
      document.getElementById('overlay').style.pointerEvents = 'all'
      document.getElementById('content').style.pointerEvents = 'all'


    }
    useEffect(() => {
        setSizes([column1Size + '%', 100 - column1Size + '%']);
      }, [column1Size]);
    return (    
        <SplitPane split="vertical" sizes={sizes} onChange={handleSizeChange} onDragEnd={handleDragFinish}>
        {children}
        </SplitPane>
    );
};

export default MySplitPane