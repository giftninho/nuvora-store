import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p><strong>Nuvora Store</strong> &copy; {new Date().getFullYear()}. All rights reserved.</p>
        <p>Simple finds. Beautifully delivered. — HNG15 Lesson 2 Project</p>
      </div>
    </footer>
  );
}
