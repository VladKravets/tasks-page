import React, { useRef, useEffect, memo } from 'react';
import WebViewer from '@pdftron/webviewer';

import * as S from './styled';

const Viewer = ({ dataPoints, url }) => {
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
      // instance.disableElements(['leftPanel', 'leftPanelButton']);
      instance.disableElements(['searchButton']);
      // instance.disableElements(['filterAnnotationButton']);
      // todo remove search and docs - css
      instance.disableFeatures([instance.Feature.Ribbons]);

      const { docViewer, FitMode } = instance;

      // docViewer.setTextHighlightColor("rgba(0, 255, 0, 0.5)");

      // const color = new Annotations.Color(3, 244, 252, 0.5);

      // docViewer.getTool('AnnotationCreateTextHighlight').setStyles(currentStyle => ({
      //   StrokeColor: new Annotations.Color(0, 221, 255)
      // }));

      // docViewer.getTool('AnnotationCreateFreeText').setStyles(currentStyle => ({
      //   StrokeThickness: 5,
      //   StrokeColor: new Annotations.Color(0, 0, 255),
      //   FillColor: color,
      //   // FontSize: '20pt'
      // }));

      const annotManager = docViewer.getAnnotationManager();

      console.log({ annotations: annotManager.getAnnotationsList() });
      docViewer.on('annotationsLoaded', () => {
        // annotManager.getAnnotationsList().forEach((a) => {
        //   a.Color.R = 3;
        //   a.Color.G = 244;
        //   a.Color.B = 252;
        //   a.Color.A = 0.5;
        // });

        const annots = annotManager.getAnnotationsList();
        console.log(annots);
        console.log(dataPoints);
        // const dataPointsIds = dataPoints.map((d) => d.id);
        // annots.forEach((annotation) => {
        // annotManager.setAnnotationStyles(annotation, () => ({
        //   StrokeThickness: 30, // padding
        //   StrokeColor: color,
        //   FillColor: color,
        // }));
        // if (!dataPointsIds.includes(annotation.Author))
        //   annotManager.hideAnnotation(annotation);
        // });
      });

      annotManager.setAnnotationDisplayAuthorMap((annotation) => {
        const dataPoint = dataPoints.find((d) => d.id === annotation.Author);
        return dataPoint ? dataPoint.title : '';
      });

      docViewer.on('documentLoaded', function () {
        console.log({ documentLoaded: annotManager.getAnnotationsList() });
        instance.setFitMode(FitMode.FitToPage);
      });
    });
    // eslint-disable-next-line
  }, [url]);

  return <S.Webviewer ref={vieweDiv2}></S.Webviewer>;
};

export default memo(Viewer);
