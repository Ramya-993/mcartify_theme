import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";

export const useAppEngage = () => {
  const { store } = useSelector((state: RootState) => state.store);

  // These could be retrieved from the store data if available
  const appStoreLink = store?.appDownloadLinks?.appStore || "#";
  const playStoreLink = store?.appDownloadLinks?.playStore || "#";

  return {
    appStoreLink,
    playStoreLink,
  };
};
