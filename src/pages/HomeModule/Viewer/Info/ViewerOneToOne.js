import React, { useState } from "react";
import { ReactComponent as IconOneToOne } from "assets/svg/IconStreams.svg";
import { ReactComponent as IconArrowRight } from "assets/svg/IconArrowDocumentViewer.svg";
import { ReactComponent as IconArrowLeft } from "assets/svg/IconLeftView.svg";
import cn from "classnames";
// import style from "./style.module.scss";

const ViewerOneToOne = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={(e) => setIsOpen(!isOpen)}
        className={cn(style.viewerProperties, `${isOpen ? style.isOpen : ""}`)}
      >
        <div className={style.viewerProperties__wrapper}>
          <div className={style.viewerProperties__wrapper__icon}>
            {isOpen ? <IconArrowLeft /> : <IconOneToOne />}
          </div>
          <p>1-to-1 meeting</p>
        </div>
        <div className={style.viewerProperties__iconToogle}>
          {isOpen ? "" : <IconArrowRight />}
        </div>
      </div>
      {isOpen && <div></div>}
    </>
  );
};

export default ViewerOneToOne;
