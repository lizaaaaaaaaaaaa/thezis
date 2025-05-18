import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ProfileSidebar.module.scss";
import exit from "../../../assets/svg/exit.svg";

const ProfileSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get("view");
  const navigate = useNavigate();

  const setView = (view) => {
    setSearchParams({ view });
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuth");
    navigate("/");
  };

  return (
    <aside className={styles.profile__sidebar}>
      <button
        onClick={() => setView("settings")}
        className={currentView === "settings" ? styles.active : null}
      >
        Дані акаунта
      </button>
      <button
        onClick={() => setView("favorites")}
        className={currentView === "favorites" ? styles.active : null}
      >
        Улюблені продукти
      </button>
      <button
        onClick={() => setView("saved")}
        className={currentView === "saved" ? styles.active : null}
      >
        Збережені склади
      </button>
      <button className={styles["profile__btn-exit"]} onClick={handleLogout}>
        <img src={exit} alt="Вийти" />
        Вийти
      </button>
    </aside>
  );
};

export default ProfileSidebar;
