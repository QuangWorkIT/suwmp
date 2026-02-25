import { Link } from "react-router"
import { Recycle, Mail, Phone, MapPin } from "lucide-react"

function Footer() {
    // TODO: Replace with actual footer data from API/state
    const mockFooterLinks = {
        about: [
            { name: "About Us", path: "/about" },
            { name: "Our Mission", path: "/about#mission" },
            { name: "Contact", path: "/about#contact" },
        ],
        resources: [
            { name: "Waste Guide", path: "/wasteguide" },
            { name: "Recycling Tips", path: "/wasteguide#tips" },
            { name: "FAQ", path: "/about#faq" },
        ],
        legal: [
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Terms of Service", path: "/terms" },
            { name: "Cookie Policy", path: "/cookies" },
        ],
    }

    const mockContactInfo = {
        email: "contact@Eco-Collect.local",
        phone: "+1 (555) 123-4567",
        address: "123 Green Street, Eco City, EC 12345",
    }

    return (
        <footer className="w-full border-t border-border bg-muted/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="mb-4 flex items-center gap-2">
                            <Recycle className="h-6 w-6 text-primary" />
                            <span className="text-xl font-semibold text-foreground">Eco-Collect</span>
                        </Link>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Sustainable Urban Waste Management Platform. Making waste management
                            easy and environmentally responsible for everyone.
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <a href={`mailto:${mockContactInfo.email}`} className="hover:text-primary">
                                    {mockContactInfo.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${mockContactInfo.phone}`} className="hover:text-primary">
                                    {mockContactInfo.phone}
                                </a>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{mockContactInfo.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* About Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-foreground">About</h3>
                        <ul className="space-y-2">
                            {mockFooterLinks.about.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-foreground">Resources</h3>
                        <ul className="space-y-2">
                            {mockFooterLinks.resources.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
                        <ul className="space-y-2">
                            {mockFooterLinks.legal.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 border-t border-border pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Eco-Collect. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
