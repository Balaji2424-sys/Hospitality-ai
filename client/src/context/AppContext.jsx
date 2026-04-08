import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

const dictionaries = {
  en: {
    appName: "RuralCare AI",
    diagnosis: "AI Diagnosis",
    appointments: "Appointments",
    history: "History",
    notifications: "Notifications",
    doctorAnalytics: "Doctor Analytics",
    logout: "Logout"
  },
  hi: {
    appName: "रूरलकेयर एआई",
    diagnosis: "एआई जांच",
    appointments: "अपॉइंटमेंट",
    history: "इतिहास",
    notifications: "सूचनाएं",
    doctorAnalytics: "डॉक्टर विश्लेषण",
    logout: "लॉगआउट"
  },
  ta: {
    appName: "ரூரல்கேர் AI",
    diagnosis: "AI நோயறிதல்",
    appointments: "சந்திப்புகள்",
    history: "வரலாறு",
    notifications: "அறிவிப்புகள்",
    doctorAnalytics: "மருத்துவர் பகுப்பாய்வு",
    logout: "வெளியேறு"
  }
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : { token: "", user: null };
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: dictionaries[language],
      auth,
      setAuth
    }),
    [language, auth]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
