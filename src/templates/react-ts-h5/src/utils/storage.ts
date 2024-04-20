export const storage = {
  session: {
    getItem: (key: string) => {
      const value = sessionStorage.getItem(key);
      if (value) return JSON.parse(value);
      return null;
    },
    setItem: (key: string, value: any) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key: string) => {
      sessionStorage.removeItem(key);
    },
  },
  local: {
    getItem: (key: string) => {
      const value = localStorage.getItem(key);
      if (value) return JSON.parse(value);
      return null;
    },
    setItem: (key: string, value: any) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key: string) => {
      localStorage.removeItem(key);
    },
  },
};
