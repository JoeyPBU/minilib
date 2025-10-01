"use client";

import Image from "next/image";
import "../styles/header.css";

export default function SiteHeader() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="profile-circle" />
        <span className="user-name">Sir Readsalot</span>
      </div>

      <div className="header-center">
        <h1 className="app-title">
          <Image
            src="/booknook.png"
            alt="Booknook"
            width={25} 
            height={25}
            className="app-logo"
          />
          <span className="app-text">Booknook</span>
        </h1>
        <p className="app-subtitle">Your personal Mini-Library</p>
      </div>
    </header>
  );
}
