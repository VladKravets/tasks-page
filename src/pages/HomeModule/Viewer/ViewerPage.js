import WebViewer from '@pdftron/webviewer';
import { CircularProgress } from '@material-ui/core';
import React, { useRef, useEffect, Component, FC } from 'react';
import { withRouter } from 'react-router-dom';

import http from 'http/index';

import ViewerTitle from './ViewerTitle';
import ViewerInfo from './ViewerInfo';

import style from './style.module.scss';

const ViewerDoc = ({ dataPoints, url }) => {
  const vieweDiv2 = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: 'lib',
        initialDoc: url,
        licenseKey: '',
        fullAPI: true,
        css: 'viewer.css',
      },
      vieweDiv2.current
    ).then((instance) => {
      // instance.disableElements(['toolbarGroup-Annotate']);
      instance.disableElements(['toolbarGroup-Shapes']);
      instance.disableElements(['toolbarGroup-Edit']);
      instance.disableElements(['toolbarGroup-Insert']);
      instance.disableElements(['leftPanel', 'leftPanelButton']);
      instance.disableElements(['searchButton']);
      instance.disableElements(['filterAnnotationButton']);
      // todo remove search and docs - css
      instance.disableFeatures([instance.Feature.Ribbons]);

      const { docViewer, FitMode, Annotations } = instance;

      docViewer.setTextHighlightColor('rgba(0, 255, 0, 0.5)');

      const annotManager = docViewer.getAnnotationManager();

      const color = new Annotations.Color(3, 244, 252, 0.5);

      docViewer.on('annotationsLoaded', () => {
        const annots = annotManager.getAnnotationsList();
        console.log(annots);
        console.log(dataPoints);
        const dataPointsIds = dataPoints.map((d) => d.id);
        annots.forEach((annotation) => {
          annotManager.setAnnotationStyles(annotation, () => ({
            StrokeThickness: 30, // padding
            StrokeColor: color,
            FillColor: color,
          }));
          if (!dataPointsIds.includes(annotation.Author))
            annotManager.hideAnnotation(annotation);
        });
      });

      annotManager.setAnnotationDisplayAuthorMap((annotation) => {
        const dataPoint = dataPoints.find((d) => d.id === annotation.Author);
        return dataPoint ? dataPoint.title : '';
      });

      docViewer.on('documentLoaded', function () {
        instance.setFitMode(FitMode.FitWidth);
      });
    });
  }, [dataPoints, url]);

  return <div ref={vieweDiv2} className={style.webviewer}></div>;
};

class ViewerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      url: '',
    };
  }

  async componentDidMount() {
    const id = this.props.location.state.id;
    const viewUrl = await http.get(
      `/documents/${id}/view?annotate-data-points=true`
    );
    const { data } = await http.get(`/documents/${id}`);
    const blob = await viewUrl.blob();
    this.setState({
      url: URL.createObjectURL(blob),
      data: {
        ...data,
        dataPoints: data.dataPoints.sort((a, b) =>
          a.title.localeCompare(b.title)
        ),
      },
    });
  }

  render() {
    if (!this.state.data)
      return (
        <div className={style.loading}>
          <CircularProgress />
        </div>
      );
    const {
      url,
      data: { dataPoints, status, title, type },
    } = this.state;
    return (
      <div className={style.viewer}>
        <ViewerInfo
          id={this.props.location.state.id}
          status={status}
          title={title}
          type={type && type.status}
        />
        <div className={style.viewerFile}>
          <ViewerTitle
            id={this.props.location.state.id}
            dataPoints={dataPoints}
            title={title}
          />
          {this.state.url && <ViewerDoc dataPoints={dataPoints} url={url} />}
        </div>
      </div>
    );
  }
}

export default withRouter(ViewerPage);
