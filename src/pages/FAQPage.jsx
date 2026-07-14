import { useState } from "react"
import { ChevronDown, ChevronUp, ShoppingBag, Truck, CreditCard, RefreshCw, Store, User } from "lucide-react"
import { Link } from "react-router-dom"

const faqs = [
  {
    category: "Shopping",
    icon:      ShoppingBag,
    questions: [
      {
        q: "How do I place an order on Vendly?",
        a: "Browse products, add items to your cart, then proceed to checkout. Fill in your delivery address and pay securely via Paystack. You will receive an order confirmation email immediately after payment.",
      },
      {
        q: "Do I need an account to shop on Vendly?",
        a: "Yes, you need a verified Vendly account to place orders. Registration is free and only takes a few minutes. You will need to verify your email address via OTP before your account is activated.",
      },
      {
        q: "Are the products on Vendly genuine?",
        a: "All vendors on Vendly are verified before they can list products. However, if you receive a product that is not as described, our 7-day return policy protects you.",
      },
      {
        q: "Can I cancel my order after placing it?",
        a: "You can cancel your order before it is shipped by contacting the vendor or our support team. Once an order has been shipped, it cannot be cancelled but you can initiate a return after delivery.",
      },
    ],
  },
  {
    category: "Delivery",
    icon:      Truck,
    questions: [
      {
        q: "How much does delivery cost?",
        a: "Delivery is FREE for orders above ₦50,000. For orders below ₦50,000, a flat delivery fee of ₦2,500 applies. Delivery is available nationwide across all 36 states in Nigeria.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery typically takes 2-5 business days within Lagos and 3-7 business days to other states. Delivery timelines depend on the vendor and your location.",
      },
      {
        q: "Can I track my order?",
        a: "Yes, you can track your order status in your profile under Order History. You will also receive email updates when your order is confirmed, shipped and delivered.",
      },
      {
        q: "Do you deliver outside Nigeria?",
        a: "Currently Vendly only delivers within Nigeria. We are working on expanding our delivery to other African countries in the future.",
      },
    ],
  },
  {
    category: "Payments",
    icon:      CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major debit and credit cards, bank transfers, USSD and QR code payments through Paystack. All transactions are secured with bank-level encryption.",
      },
      {
        q: "Is it safe to pay on Vendly?",
        a: "Yes, all payments are processed by Paystack, one of Africa's most trusted payment processors. We never store your card details on our servers.",
      },
      {
        q: "Why was my payment declined?",
        a: "Payment can be declined due to insufficient funds, incorrect card details or bank restrictions on online transactions. Please contact your bank or try a different payment method.",
      },
      {
        q: "Do you offer instalment payments?",
        a: "We do not currently offer instalment payments directly. However, some banks offer buy-now-pay-later options through their debit cards which you can use on Vendly.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon:      RefreshCw,
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return policy from the date of delivery. Items must be unused, in original condition and packaging. See our full Refund Policy for details.",
      },
      {
        q: "How long does a refund take?",
        a: "Once your return is approved, refunds are processed within 3-5 business days to your original payment method. Your bank may take an additional 2-3 days to reflect the amount.",
      },
      {
        q: "What if I received a damaged or wrong item?",
        a: "We apologise for the inconvenience. Please take photos of the item and contact us within 24 hours of delivery. We will arrange a return and full refund or replacement at no cost to you.",
      },
    ],
  },
  {
    category: "Selling on Vendly",
    icon:      Store,
    questions: [
      {
        q: "How do I become a vendor on Vendly?",
        a: "Click 'Sell on Vendly' in the navigation menu and complete the vendor application form. Our team reviews applications within 2-3 business days. Once approved, you can start listing products immediately.",
      },
      {
        q: "Is there a fee to sell on Vendly?",
        a: "Applying to become a vendor is completely free. We charge a small commission on each sale to cover platform costs. The exact commission rate will be communicated during the application process.",
      },
      {
        q: "How do I get paid as a vendor?",
        a: "Payments are processed through Paystack and transferred to your registered bank account. Payouts are made after order confirmation and the buyer's return window has passed.",
      },
    ],
  },
  {
    category: "Account",
    icon:      User,
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot password?' on the login page, enter your email address and we will send you a 6-digit reset code. Enter the code and set your new password.",
      },
      {
        q: "How do I delete my account?",
        a: "To delete your account, please contact our support team at support@vendly.ng. Note that deleting your account will remove all your data including order history.",
      },
      {
        q: "Can I change my email address?",
        a: "Currently email address changes require contacting our support team for security reasons. Please email support@vendly.ng with your request.",
      },
    ],
  },
]

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between px-4 py-4 sm:px-5 text-left bg-white hover:bg-gray-50 transition"
      >
        {/* items-start so icon stays top-aligned when question wraps */}
        <span className="text-sm font-semibold text-gray-800 pr-3 leading-snug">
          {question}
        </span>
        {open
          ? <ChevronUp size={18} className="text-primary flex-shrink-0 mt-0.5" />
          : <ChevronDown size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 sm:px-5 bg-white">
          <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Shopping")

  const current = faqs.find((f) => f.category === activeCategory)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* ── Header ── */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Find answers to common questions about Vendly
        </p>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* ── Category nav ──
            Mobile / tablet : horizontal pill strip with snap scrolling
            Desktop         : vertical sidebar column
        ── */}
        <nav
          aria-label="FAQ categories"
          className="
            flex flex-row md:flex-col
            gap-2
            overflow-x-auto md:overflow-x-visible
            pb-1 md:pb-0
            snap-x md:snap-none
            scroll-smooth
            -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0
            md:w-52 md:flex-shrink-0
            scrollbar-hide
          "
        >
          {faqs.map(({ category, icon: Icon }) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                flex items-center gap-2
                px-3 py-2.5 sm:px-4
                rounded-xl text-sm font-semibold
                transition
                whitespace-nowrap
                snap-start
                flex-shrink-0 md:flex-shrink md:w-full
                ${activeCategory === category
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-100 hover:border-primary hover:text-primary"
                }
              `}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span>{category}</span>
            </button>
          ))}
        </nav>

        {/* ── Questions panel ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <h2 className="font-bold text-gray-800 text-base sm:text-lg mb-1">
            {activeCategory}
          </h2>

          {current?.questions.map(({ q, a }) => (
            <FAQItem key={q} question={q} answer={a} />
          ))}
        </div>

      </div>

      {/* ── Still have questions ── */}
      <div className="mt-8 sm:mt-10 bg-gray-50 rounded-2xl p-5 sm:p-6 text-center">
        <h3 className="font-bold text-gray-800 mb-1 sm:mb-2">
          Still have questions?
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Our support team is available Monday to Friday, 8am – 6pm WAT
        </p>
        <Link
          to="mailto:noreply.vendly@gmail.com"
          className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition inline-block"
        >
          Contact Support
        </Link>
      </div>

    </div>
  )
}

export default FAQPage