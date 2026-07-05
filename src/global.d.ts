/* ============================================================
   Hunar.pk — Global JSX type declarations
   ------------------------------------------------------------
   Declares the iconify-icon web component (loaded via CDN in
   layout.tsx) so TypeScript recognizes <iconify-icon ... />.
   React 19 moved the JSX namespace to React.JSX.
   ============================================================ */

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      // Permissive type: web components accept any string/number attrs.
      // `class` (lowercase) is used instead of React's `className`.
      "iconify-icon": {
        icon?: string;
        width?: number | string;
        height?: number | string;
        flip?: string;
        rotate?: number | string;
        inline?: boolean;
        mode?: string;
        noobserver?: boolean;
        class?: string;
        style?: import("react").CSSProperties;
        onClick?: import("react").MouseEventHandler<HTMLElement>;
        id?: string;
        title?: string;
        "aria-hidden"?: boolean | "true" | "false";
        "aria-label"?: string;
        role?: string;
        children?: import("react").ReactNode;
        [key: string]: unknown;
      };
    }
  }
}

export {};
