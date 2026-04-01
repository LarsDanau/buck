import { render, renderHook, screen, userEvent } from "@testing-library/react-native";
import type { ComponentType, PropsWithChildren, ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/src/lib/i18n/i18n";

function AppProviders({ children }: PropsWithChildren) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

function composeWrapper(InnerWrapper?: ComponentType<PropsWithChildren>) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <AppProviders>
        {InnerWrapper ? <InnerWrapper>{children}</InnerWrapper> : children}
      </AppProviders>
    );
  };
}

export const renderWithProviders = (
  ui: ReactElement,
  options?: {
    wrapper?: ComponentType<PropsWithChildren>;
  },
) =>
  render(ui, {
    wrapper: composeWrapper(options?.wrapper),
  });

export const renderHookWithProviders = <Result,>(
  hook: () => Result,
  options?: {
    wrapper?: ComponentType<PropsWithChildren>;
  },
) =>
  renderHook(hook, {
    wrapper: composeWrapper(options?.wrapper),
  });

export { screen, userEvent };
