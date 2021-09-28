import React, { ReactElement } from "react";

interface Props {
  children: any;
}

export default function Card({ children }: Props): ReactElement {
  return (
    <div
      className="site-layout-background"
      style={{
        padding: 24,
        minHeight: 200,
        marginBottom: 36,
        overflow: "scroll",
      }}
    >
      {children}
    </div>
  );
}
