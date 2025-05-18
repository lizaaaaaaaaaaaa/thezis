import React from "react";
import styles from "./ProfileMain.module.scss";
import ProfileSidebar from "./ProfileSidebar/ProfileSidebar";
import ProfileContent from "./ProfileContent/ProfileContent";

const ProfileMain = () => {
  return (
    <section className={`container ${styles.profile}`}>
      <ProfileSidebar />
      <ProfileContent />
    </section>
  );
};

export default ProfileMain;
