import "./Settings.css";
import { useTranslation } from "../../../../hooks/translation/useTranslation";
import { useAppSelector } from "../../../../hooks/store/useAppSelector";
import { useAppDispatch } from "../../../../hooks/store/useAppDispatch";
import { setTheme } from "../../../../store/theme/themeSlice";
import { Moon, Sun } from "lucide-react";
import type { ThemeMode } from "../../../../store/theme/themeSlice";

interface SettingsProps {
  isActive: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isActive }) => {
  const { language } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  const handleThemeChange = (mode: ThemeMode) => {
    dispatch(setTheme(mode));
  };

  return (
    <div className={`settings ${isActive ? "settings_active" : ""}`}>
      <div className="settings__section">
        <span className="settings__label">Language</span>
        <div className="settings__language">
          <span className="settings__language-span">{language}</span>
        </div>
      </div>
      <div className="settings__section">
        <span className="settings__label">Theme</span>
        <div className="settings__theme">
          <button
            type="button"
            className={`settings__theme-btn ${
              theme === "light" ? "settings__theme-btn_active" : ""
            }`}
            onClick={() => handleThemeChange("light")}
            title="Light theme"
            aria-label="Light theme"
          >
            <Sun className="settings__theme-icon" />
          </button>
          <button
            type="button"
            className={`settings__theme-btn ${
              theme === "dark" ? "settings__theme-btn_active" : ""
            }`}
            onClick={() => handleThemeChange("dark")}
            title="Dark theme"
            aria-label="Dark theme"
          >
            <Moon className="settings__theme-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
