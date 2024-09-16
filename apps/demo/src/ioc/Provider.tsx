import { createContext, type FC, type PropsWithChildren } from "react";
import { Container } from "./Container";

export const Context = createContext<Container | null>(null);
export const Provider: FC<
  PropsWithChildren<{ container: Container }>
> = (props) => {
  const { container, children } = props;
  return <Context.Provider value={container}>{children}</Context.Provider>;
};
