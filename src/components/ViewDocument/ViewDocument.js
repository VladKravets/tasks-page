import React, { Component, useRef, createRef, useEffect } from 'react';
import Viewer, {
  Worker,
  defaultLayout,
  Slot,
  RenderToolbar,
  ToolbarSlot,
  SpecialZoomLevel,
} from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import './style.module.scss';
import WebViewer from '@pdftron/webviewer';
import style from './style.module.scss';

import http from 'http/index';

// const renderToolbar = (toolbarSlot: ToolbarSlot): React.ReactElement => {

//   return (

//     <div style={{
//       display: 'flex',
//       width: '100%',
//       height: '50px',
//       alignItems: 'center',
//       background: '#F2F4F4',
//       justifyContent: 'space-between',
//       fontFamily: 'Roboto',
//       fontStyle: 'normal',
//       fontWeight: 'normal',
//       fontSize: '15px',
//       lineHeight: '24px',
//       color: '#304156',
//       // padding: '0 8px',
//       border: '1px solid #E7EDF3',
//       // borderRadius: '4px',
//     }}>
//       <div style={{
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <div style={{ borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.toggleSidebarButton}
//         </div>
//         <div style={{ borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.searchPopover}
//         </div>
//         <div style={{ borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.previousPageButton}
//         </div>
//         <div style={{ padding: '5px', margin: '0 3px', borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.currentPage + 1} / {toolbarSlot.numPages}
//         </div>
//         <div style={{borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.nextPageButton}
//         </div>
//       </div>
//       <div style={{
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <div style={{ padding: '0 0px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.zoomOutButton}
//         </div>
//         <div style={{ padding: '0 0px'}}>
//           {toolbarSlot.zoomPopover}
//         </div>
//         <div style={{ padding: '0 0px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.zoomInButton}
//         </div>

//       </div>
//       <div style={{
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <div style={{ padding: ' 0 5px', margin: '0 3px', borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.fullScreenButton}
//         </div>
//         <div style={{ padding: ' 0 5px', margin: '0 3px', borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.downloadButton}
//         </div>
//         <div style={{ padding: ' 0 5px', margin: '0 3px', borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.printButton}
//         </div>
//         <div style={{ padding: ' 0 5px', margin: '0 3px', borderRadius: '4px', border: '1px solid #E1E5E9' }}>
//           {toolbarSlot.moreActionsPopover}
//         </div>
//       </div>
//     </div>
//   );
// };

// const layout = (
//   isSidebarOpened: boolean,
//   container: Slot,
//   main: Slot,
//   toolbar: RenderToolbar,
//   sidebar: Slot,
// ): React.ReactElement => {
//   return defaultLayout(
//       isSidebarOpened,
//       container,
//       main,
//       toolbar(renderToolbar),
//       sidebar,
//   );
// };

// const layout = (
//   isSidebarOpened: boolean,
//   container: Slot,
//   main: Slot,
//   toolbar: RenderToolbar,
//   sidebar: Slot,
// ): React.ReactElement => {
//   return (
//     <>
//       {toolbar(renderToolbar)}
//       {isSidebarOpened && sidebar.children}
//       {/* <div
//         {...container.attrs}
//         style={Object.assign({}, {

//           height: '100%',
//           //overflow: 'scroll',
//           // width: '100%',
//         }, )}
//       > */}
//         {/* {container.children} */}
//         <div
//           {...main.attrs}
//           style={Object.assign({}, {
//             height: '100%',
//             overflow: 'scroll',
//             // width: '100%',
//           }, main.attrs.style)}
//         >
//           <div style={{ width: '100%' }}>{main.children}</div>
//         </div>
//       {/* </div> */}
//     </>
//   )
// };

const ViewerTest = () => {
  const myRef = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: 'lib',
        initialDoc:
          'https://www.jianjunchen.com/papers/CORS-USESEC18.slides.pdf',
        licenseKey: '',
      },
      myRef.current
    ).then((instance) => {
      instance.disableElements(['toolbarGroup-Annotate']);
      instance.disableElements(['toolbarGroup-Shapes']);
      instance.disableElements(['toolbarGroup-Edit']);
      instance.disableElements(['toolbarGroup-Insert']);

      let annotManager = instance.annotManager;
    });
  });

  return <div ref={myRef} className={style.viewer}></div>;
};

class ViewDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
  }

  async componentDidMount() {
    const res = await http.get(
      `/documents/${this.props.id}/view?annotate-data-points=true`
    );
    const blob = await res.blob();
    this.setState({ url: URL.createObjectURL(blob) });
  }

  render() {
    if (this.state.url) {
      return (
        // <ViewerTest />
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
          <Viewer
            fileUrl={this.state.url}
            defaultScale={SpecialZoomLevel.PageFit}
          />
        </Worker>
      );
    } else {
      return <span>Loading…</span>;
    }
  }
}

export default ViewDocument;
