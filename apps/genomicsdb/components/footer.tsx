import Link from "next/link"
import "./footer.css"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">
            <span className="footer-logo-text">NIAGADS GenomicsDB</span>
          </div>
          <p className="footer-copyright">© {currentYear} NIAGADS. All rights reserved.</p>
        </div>

        <div className="footer-right">
          <nav className="footer-nav">
            <Link href="/about" className="footer-link">
              About
            </Link>
            <a href="#" className="footer-link">
              Contact
            </a>
            <a href="#" className="footer-link">
              Privacy
            </a>
            <a href="#" className="footer-link">
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
