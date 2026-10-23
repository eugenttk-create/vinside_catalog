import styles from "./Settings.module.css";
import shared from "../../../../styles/common.module.css";
import { useTranslation } from "../../../../hooks/translation/useTranslation";
import { useAppSelector } from "../../../../hooks/store/useAppSelector";
import { useAppDispatch } from "../../../../hooks/store/useAppDispatch";
import { setTheme, setPalette } from "../../../../store/theme/themeSlice";
import { palettes } from "../../../../store/theme/palettes";
import { Moon, Sun } from "lucide-react";
import type { ThemeMode } from "../../../../store/theme/themeSlice";

interface SettingsProps {
  isActive: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isActive }) => {
  const { language } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const selectedPalette = useAppSelector((state) => state.theme.palette);

  const handleThemeChange = (mode: ThemeMode) => {
    dispatch(setTheme(mode));
  };

  return (
    <div className={`${styles["settings"]} ${isActive ? styles["settings_active"] : ""}`}>
      <div className={styles["settings__section"]}>
        <span className={styles["settings__label"]}>Language</span>
        <div className={shared["settings__language"]}>
          <span className={styles["settings__language-span"]}>{language}</span>
        </div>
      </div>
      <div className={styles["settings__section"]}>
        <span className={styles["settings__label"]}>Theme</span>
        <div className={styles["settings__theme"]}>
          <button
            type="button"
            className={`${styles["settings__theme-btn"]} ${theme === "light" ? styles["settings__theme-btn_active"] : ""}`}
            onClick={() => handleThemeChange("light")}
            title="Light theme"
            aria-label="Light theme"
          >
            <Sun className={styles["settings__theme-icon"]} />
          </button>
          <button
            type="button"
            className={`${styles["settings__theme-btn"]} ${theme === "dark" ? styles["settings__theme-btn_active"] : ""}`}
            onClick={() => handleThemeChange("dark")}
            title="Dark theme"
            aria-label="Dark theme"
          >
            <Moon className={styles["settings__theme-icon"]} />
          </button>
        </div>
      </div>
      <div className={styles["settings__section"]}>
        <span className={styles["settings__label"]}>Palette</span>
        <div className={styles["settings__palettes"]} role="group" aria-label="Color palette">
          {palettes.map((palette) => (
            <button
              key={palette.id}
              type="button"
              className={styles["settings__palette"]}
              style={{ backgroundColor: palette.color }}
              aria-label={`${palette.name} palette`}
              aria-pressed={selectedPalette === palette.id}
              title={palette.name}
              data-palette-choice={palette.id}
              onClick={() => dispatch(setPalette(palette.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
