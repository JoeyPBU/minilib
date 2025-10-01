"use client";

import "../styles/footer.css";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <p className="footer-title">Booknook</p>
      <p className="footer-sub">Made by Joseph P</p>
      <p className="footer-links">
        <a href="#">Privacy Policy</a> | <a href="#">Cookies</a>
      </p>
      <p className="footer-address">
        10 Downing Street, Westminster, London, SW1A 2AA, United Kingdom
      </p>
    </footer>
  );
}
