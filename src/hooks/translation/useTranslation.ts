import { useCallback } from "react";
import { useAppSelector } from "../store/useAppSelector";
import { useAppDispatch } from "../store/useAppDispatch";
import { setLanguage } from "../../store/language/languageSlice";
//@ts-ignore
import { translations } from "../../utils/translation";

export const useTranslation = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const t = translations[language];
  const languageArray = Object.keys(translations);

  const changeLanguage = useCallback(
    (lang: string) => {
      dispatch(setLanguage(lang));
    },
    [dispatch]
  );

  return {
    language,
    t,
    changeLanguage,
    languageArray,
  };
};
