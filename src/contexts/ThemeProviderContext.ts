import React from "react";
import { Theme } from "../Themes/ThemeClass";
interface ThemeProviderContextInterface {
  themeObject: Theme | null;
}
export default React.createContext<ThemeProviderContextInterface>({
  themeObject: null,
});
