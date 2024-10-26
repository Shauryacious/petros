"use client";

import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/uploadData", label: "Add Person" },
    { href: "/Buy-glass", label: "Buy" },
    { href: "/faq", label: "FAQs" },
    { href: "/contact", label: "Contact Us" },
    { href: "/about", label: "About" },
  ];

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 shadow-slate-300",
        className
      )}
    >
      <Menu setActive={setActive}>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <MenuItem setActive={setActive} active={active} item={item.label} />
          </Link>
        ))}
      </Menu>
    </div>
  );
}

export default Navbar;
