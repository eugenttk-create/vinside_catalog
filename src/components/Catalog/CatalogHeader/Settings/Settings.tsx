import "./Settings.css";
import { useTranslation } from "../../../../hooks/translation/useTranslation";

interface SettingsProps {
  isActive: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isActive }) => {
  const { language } = useTranslation();

  return (
    <div className={`settings ${isActive ? "settings_active" : ""}`}>
      <div className="settings__language">
        <span className="settings__language-span">{language}</span>
      </div>
    </div>
  );
};

export default Settings;
