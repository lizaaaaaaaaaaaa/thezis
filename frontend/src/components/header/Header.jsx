import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/svg/logo.svg";
import styles from "./Header.module.scss";
import user from "../../assets/svg/user.svg";
import LogInForm from "./LogInForm/LogInForm";
import menu from "../../assets/svg/menu.svg";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogInShow, setIsLogInShow] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsNavVisible(false);
    }
  }, []);

  useEffect(() => {
    setIsNavVisible(false);
    setIsLogInShow(false);
  }, [location.pathname]);

  const handleLoginSuccess = () => {
    setIsLogInShow(false);
    navigate("/profile");
  };

  const toggleLoginForm = () => {
    const currentAuth = localStorage.getItem("isAuth");
    if (!currentAuth) {
      setIsLogInShow((prev) => !prev);
    } else {
      navigate("/profile");
    }
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.header__inner} container`}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="logo" />
          <h4>GlowUp Analyzer</h4>
        </Link>

        <div className={styles.header__right}>
          <div
            className={`${styles.header__links} ${
              isNavVisible ? styles["header__links-show"] : ""
            }`}
          >
            <Link to="/ingredients" className={styles.header__link}>
              Інгрідієнти
            </Link>
            <Link to="/products" className={styles.header__link}>
              Продукти
            </Link>
            <a
              href="https://ramosu.com.ua/uk/"
              className={styles.header__link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Відвідати сайт
            </a>
          </div>

          <div className={styles.header__user}>
            <button onClick={toggleLoginForm} className={styles.header__btn}>
              <img src={user} alt="user" className={styles.header__icon} />
            </button>

            {isLogInShow && (
              <div
                className={`${styles.header__login} ${styles["header__login-show"]}`}
              >
                <LogInForm onLoginSuccess={handleLoginSuccess} />
                <Link className={styles.header__reg} to="/register">
                  Немає акаунта? <b>Реєстрація</b>
                </Link>
              </div>
            )}
          </div>

          <button
            className={styles.menu}
            onClick={() => setIsNavVisible(!isNavVisible)}
          >
            <img src={menu} alt="menu" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
