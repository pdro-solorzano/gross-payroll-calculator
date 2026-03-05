import { useEffect, useState } from "react";
type Props<T> = { locStorageItemName: string; initialValue: T };

function useLocalStorage<T>({
  locStorageItemName,
  initialValue,
}: Props<T>): [T, React.Dispatch<T>] {
  const [appData, setAppData] = useState<T>(() => {
    const localStorageAppData = localStorage.getItem(locStorageItemName);
    if (!localStorageAppData) {
      localStorage.setItem(locStorageItemName, JSON.stringify(initialValue));
      return initialValue;
    } else {
      return JSON.parse(localStorageAppData);
    }
  });

  useEffect(() => {
    localStorage.setItem(locStorageItemName, JSON.stringify(appData));
  }, [appData, locStorageItemName]);

  return [appData, setAppData];
}

export { useLocalStorage };
