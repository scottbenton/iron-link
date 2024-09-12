/// <reference types="vite/client" />

declare global {
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
      sx?:
        | React.CSSProperties
        | ((theme: Theme) => React.CSSProperties)
        | ReadonlyArray<
            React.CSSProperties | ((theme: Theme) => React.CSSProperties)
          >;
    }
  }
}
