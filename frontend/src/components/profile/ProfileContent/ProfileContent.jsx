import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProfileDetails from "../content/ProfileDetails/ProfileDetails";
import Favorites from "./../content/Favorites/Favorites";
import SavedCompositions from "./../content/SavedCompositions/SavedCompositions";

const ProfileContent = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const navigate = useNavigate();
  useEffect(() => {
    if (!view) {
      navigate("?view=settings", { replace: true });
    }
  }, [view, navigate]);

  return (
    <>
      {view === "favorites" && <Favorites />}
      {view === "saved" && <SavedCompositions />}
      {view === "settings" && <ProfileDetails />}
    </>
  );
};

export default ProfileContent;
