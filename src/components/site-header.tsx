"use client";

import Image from "next/image";
import { useState } from "react";
import "../styles/header.css";
import UserStatsModal from "./user-stats-modal";

export default function SiteHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hardcoded Sir Readsalot
  const USER_ID = 1;

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="profile-circle" />
          <span 
            className="user-name" 
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            Sir Readsalot
          </span>
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
      
      <UserStatsModal 
        readerId={USER_ID} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
