"use client";
import React from "react";
import { Button } from "./ui/button";
import { getAurinkoAuthUrl } from "@/lib/aurinko";

const LinkAccountButton = () => {
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkoAuthUrl("Office365");
        window.location.href = authUrl;
        // console.log(authUrl);
      }}
    >
      link Account
    </Button>
  );
};

export default LinkAccountButton;
