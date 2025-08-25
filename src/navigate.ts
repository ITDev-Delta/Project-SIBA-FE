let navigator: ((to: string) => void) | undefined;

export const setNavigator = (nav: (to: string) => void): void => {
  navigator = nav;
};

export const navigate = (to: string): void => {
  if (navigator) {
    navigator(to);
  }
};
