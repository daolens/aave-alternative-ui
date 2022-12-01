import React, { MouseEventHandler, ReactNode } from "react";
import styles from "../../styles/componentStyles/cards/titleSubtitleCard.module.css";
interface Props {
  title?: string;
  subTitle?: string;
  icon?: ReactNode;
  clickHandler?: MouseEventHandler<HTMLDivElement> | undefined;
}
function TitleSubtitleCard({ title, subTitle, icon, clickHandler }: Props) {
  return (
    <div className={styles.container} onClick={clickHandler}>
      {icon}
      <div className={styles.container_right}>
        <h3 className={styles.container_right__title}>{title}</h3>
        <p className={styles.container_right__subtitle}>{subTitle}</p>
      </div>
    </div>
  );
}

export default TitleSubtitleCard;
