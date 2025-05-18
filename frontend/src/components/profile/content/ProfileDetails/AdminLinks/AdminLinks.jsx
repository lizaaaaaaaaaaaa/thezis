import React from "react";
import styles from "./AdminLinks.module.scss";
import { Link } from "react-router-dom";

const AdminLinks = () => {
  return (
    <div className={styles.profile__links}>
      <Link to={"/admin/ingredients"} className={styles.profile__link}>
        Додати нові інгрідієнти
      </Link>
      <Link to={"/admin/products"} className={styles.profile__link}>
        Додати нові товари
      </Link>
    </div>
  );
};

export default AdminLinks;
