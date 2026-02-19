import "./Settings.css";
import { useTranslation } from "../../../../hooks/translation/useTranslation";

interface SettingsProps {
  isActive: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isActive }) => {
  const { language, changeLanguage, languageArray } = useTranslation();

  return (
    <div className={`settings ${isActive ? "settings_active" : ""}`}>
      <div className="settings__language">
        <select
          name="settings-language"
          id="settings-language"
          className="settings__language-select input"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          {languageArray.map((l) => (
            <option value={l} key={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Settings;
