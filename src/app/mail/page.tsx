import React from "react";
import dynamic from "next/dynamic";
import ThemeToggle from "@/components/theme-toggle";
// import Mail from "./mail";
/* even if it is marked as use client,
nextjs do ssr this and try to hydrate it
so make sure server side dont touch this component,
make this component purely client site
by turning ssr false */
const Mail = dynamic(
  () => {
    return import("./mail");
  },
  { ssr: false },
);
//15610
const MailDashboard = () => {
  return (
    <>
      <div className="absolute bottom-4 left-4">
        <ThemeToggle />
      </div>
      <Mail
        defaultLayout={[20, 32, 48]}
        navCollapsedSize={4}
        defaultCollapsed={false}
      />
    </>
  );
};

export default MailDashboard;
