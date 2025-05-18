import React from "react";
import styles from "./RegisterMain.module.scss";
import RegisterForm from "./RegisterForm/RegisterForm";

const RegisterMain = () => {
  return (
    <section className="container">
      <div className={styles.register}>
        <div className={styles.register__glass}>
          <RegisterForm />
        </div>
      </div>
    </section>
  );
};

export default RegisterMain;
