import { FileText, Shield, ShoppingBag, Users, AlertCircle, Scale } from "lucide-react"

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

function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Terms & Conditions</h1>
        <p className="text-gray-500 text-sm mt-2">Last updated: January 1, 2026</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex gap-3">
        <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Please read these Terms and Conditions carefully before using Vendly.
          By accessing or using our platform, you agree to be bound by these terms.
        </p>
      </div>

      <div className="flex flex-col gap-8">

        <Section icon={FileText} title="1. Acceptance of Terms">
          <p>
            By accessing and using Vendly ("the Platform"), you accept and agree to be
            bound by these Terms and Conditions and our Privacy Policy. If you do not
            agree to these terms, please do not use our platform.
          </p>
          <p>
            These terms apply to all visitors, users, buyers, vendors and others who
            access or use the Vendly marketplace.
          </p>
        </Section>

        <Section icon={Users} title="2. User Accounts">
          <p>To use certain features of Vendly, you must create an account. You agree to:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Provide accurate and complete registration information</li>
            <li>Verify your account via the OTP sent to your email</li>
            <li>Maintain the security of your password</li>
            <li>Notify us immediately of any unauthorised use of your account</li>
            <li>Be responsible for all activities that occur under your account</li>
          </ul>
          <p>
            You must be at least 18 years old to create an account on Vendly.
            Accounts found to be providing false information will be terminated immediately.
          </p>
        </Section>

        <Section icon={ShoppingBag} title="3. Buying on Vendly">
          <p>When you make a purchase on Vendly, you agree that:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>You are entering into a contract with the vendor, not Vendly</li>
            <li>Vendly acts as an intermediary marketplace between buyers and vendors</li>
            <li>Product descriptions and images are provided by vendors</li>
            <li>Prices are set by vendors and may change without notice</li>
            <li>Delivery timelines are estimates and not guaranteed</li>
            <li>Payment is processed securely through Paystack</li>
          </ul>
        </Section>

        <Section icon={Users} title="4. Vendor Terms">
          <p>If you apply to become a vendor on Vendly, you agree to:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Provide accurate information about your business and products</li>
            <li>Only list products you legally own or have rights to sell</li>
            <li>Honour all orders placed through the platform</li>
            <li>Respond to customer enquiries within 24 hours</li>
            <li>Not list counterfeit, illegal or prohibited products</li>
            <li>Comply with all applicable Nigerian laws and regulations</li>
          </ul>
          <p>
            Vendly reserves the right to suspend or terminate vendor accounts that
            violate these terms or receive repeated negative feedback from buyers.
          </p>
        </Section>

        <Section icon={Shield} title="5. Prohibited Activities">
          <p>You agree not to:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Use the platform for any unlawful purpose</li>
            <li>Post false, misleading or fraudulent content</li>
            <li>Attempt to circumvent our payment systems</li>
            <li>Harass, abuse or harm other users or vendors</li>
            <li>Upload viruses or malicious code</li>
            <li>Scrape or copy content without written permission</li>
            <li>Create multiple accounts to abuse promotions or reviews</li>
          </ul>
        </Section>

        <Section icon={Scale} title="6. Limitation of Liability">
          <p>
            Vendly is a marketplace platform and is not directly liable for the
            quality, safety, legality or delivery of products listed by vendors.
            Our liability is limited to facilitating the transaction between buyer
            and vendor.
          </p>
          <p>
            In no event shall Vendly be liable for any indirect, incidental, special
            or consequential damages arising from your use of the platform.
          </p>
        </Section>

        <Section icon={FileText} title="7. Intellectual Property">
          <p>
            All content on Vendly including logos, design, text and software is the
            property of Vendly and protected by Nigerian and international copyright laws.
            You may not reproduce, distribute or create derivative works without our
            written permission.
          </p>
        </Section>

        <Section icon={FileText} title="8. Changes to Terms">
          <p>
            Vendly reserves the right to modify these Terms at any time. We will notify
            registered users of significant changes via email. Your continued use of the
            platform after changes constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section icon={FileText} title="9. Governing Law">
          <p>
            These Terms are governed by the laws of the Federal Republic of Nigeria.
            Any disputes arising from these terms shall be subject to the exclusive
            jurisdiction of the courts of Lagos State, Nigeria.
          </p>
        </Section>

        <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-1">Contact Us</p>
          <p>For questions about these Terms, contact us at <span className="text-primary">noreply.vendly@gmail.com</span></p>
        </div>

      </div>
    </div>
  )
}

export default TermsPage