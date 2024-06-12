import React from "react";
import { Theme } from "../Themes/lmThemeClass";
interface ThemeProviderContextInterface {
  themeObject: Theme | null;
}
export default React.createContext<ThemeProviderContextInterface>({
  themeObject: null,
});
