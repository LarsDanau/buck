import type { resources, defaultNS } from "@/lib/i18n/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
    enableSelector: true;
  }
}
