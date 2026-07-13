import { Shield, Database, Eye, Lock, Bell, UserX, Mail } from "lucide-react"

function Section({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      <div className="text-gray-600 text-sm leading-relaxed pl-12 flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mt-2">Last updated: January 1, 2026</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex gap-3">
        <Shield size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-700">
          Vendly is committed to protecting your personal data in accordance with the
          Nigeria Data Protection Regulation (NDPR) and applicable privacy laws.
        </p>
      </div>

      <div className="flex flex-col gap-8">

        <Section icon={Database} title="1. Information We Collect">
          <p>We collect the following types of information:</p>
          <p className="font-semibold text-gray-700">Personal Information:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Full name and email address when you register</li>
            <li>Phone number for account verification and delivery</li>
            <li>Delivery address when you place an order</li>
            <li>Payment information processed securely by Paystack</li>
          </ul>
          <p className="font-semibold text-gray-700 mt-2">Usage Information:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Pages you visit and products you view</li>
            <li>Search queries on the platform</li>
            <li>Device type, browser and IP address</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </Section>

        <Section icon={Eye} title="2. How We Use Your Information">
          <p>We use your personal information to:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Create and manage your Vendly account</li>
            <li>Process your orders and payments</li>
            <li>Send order confirmations and delivery updates</li>
            <li>Verify your identity via OTP email verification</li>
            <li>Provide customer support</li>
            <li>Improve our platform and user experience</li>
            <li>Send promotional emails (with your consent)</li>
            <li>Comply with legal obligations under Nigerian law</li>
          </ul>
        </Section>

        <Section icon={Lock} title="3. How We Protect Your Data">
          <p>
            We take the security of your personal data seriously. We implement
            appropriate technical and organisational measures including:
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Encryption of passwords using industry-standard bcrypt hashing</li>
            <li>Secure JWT authentication tokens for all sessions</li>
            <li>HTTPS encryption for all data transmission</li>
            <li>Payment data processed exclusively by Paystack — we never store card details</li>
            <li>Regular security audits of our systems</li>
          </ul>
        </Section>

        <Section icon={Database} title="4. Data Sharing">
          <p>We do not sell your personal data. We may share your information with:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li><strong>Vendors:</strong> Your delivery address and name to fulfil your order</li>
            <li><strong>Paystack:</strong> Payment processing (governed by Paystack's privacy policy)</li>
            <li><strong>Brevo:</strong> Email delivery service</li>
            <li><strong>Cloudinary:</strong> Image storage service</li>
            <li><strong>Law enforcement:</strong> When required by Nigerian law or court order</li>
          </ul>
        </Section>

        <Section icon={Bell} title="5. Cookies">
          <p>
            We use cookies to improve your experience on Vendly. Cookies are small
            text files stored on your device. We use:
          </p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li><strong>Necessary cookies:</strong> Essential for the website to function</li>
            <li><strong>Analytics cookies:</strong> Help us understand how you use our platform</li>
            <li><strong>Marketing cookies:</strong> Used to show relevant promotions</li>
          </ul>
          <p>
            You can manage your cookie preferences using the cookie consent banner
            or your browser settings.
          </p>
        </Section>

        <Section icon={UserX} title="6. Your Rights Under NDPR">
          <p>Under the Nigeria Data Protection Regulation, you have the right to:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your data for marketing</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with NITDA (National Information Technology Development Agency)</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <span className="text-primary">privacy@vendly.ng</span>
          </p>
        </Section>

        <Section icon={Database} title="7. Data Retention">
          <p>
            We retain your personal data for as long as your account is active or
            as needed to provide services. Order history is retained for 7 years
            for accounting and legal compliance purposes. You may request deletion
            of your account and associated data at any time.
          </p>
        </Section>

        <Section icon={Mail} title="8. Contact Our Data Protection Officer">
          <p>
            If you have any questions about this Privacy Policy or how we handle
            your data, please contact our Data Protection Officer:
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mt-2">
            <p><strong>Vendly Data Protection Officer</strong></p>
            <p>Email: privacy@vendly.ng</p>
            <p>Address: Lagos, Nigeria</p>
          </div>
        </Section>

      </div>
    </div>
  )
}

export default PrivacyPolicyPage