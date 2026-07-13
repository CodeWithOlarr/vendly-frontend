import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, Truck, Phone } from "lucide-react"

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

function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Return & Refund Policy</h1>
        <p className="text-gray-500 text-sm mt-2">Last updated: January 1, 2026</p>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Clock,        color: "bg-blue-50 text-blue-600",   title: "7-Day Returns",    desc: "Return within 7 days of delivery"     },
          { icon: RefreshCw,    color: "bg-green-50 text-green-600", title: "Easy Process",     desc: "Simple return request via your profile" },
          { icon: CheckCircle,  color: "bg-orange-50 text-orange-600", title: "Fast Refunds",   desc: "Refunds processed within 3-5 business days" },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
              <Icon size={22} />
            </div>
            <p className="font-bold text-gray-800 text-sm">{title}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8">

        <Section icon={RefreshCw} title="1. Return Eligibility">
          <p>You may return a product within <strong>7 days of delivery</strong> if:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>The item is defective or damaged upon arrival</li>
            <li>The item received is different from what was ordered</li>
            <li>The item is significantly not as described by the vendor</li>
            <li>The item arrived incomplete or with missing parts</li>
          </ul>
          <p>
            To be eligible for a return, the item must be unused, in its original
            condition and in the original packaging where possible.
          </p>
        </Section>

        <Section icon={XCircle} title="2. Non-Returnable Items">
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>Perishable goods such as food and beverages</li>
            <li>Digital products and software after download</li>
            <li>Personal hygiene products once opened</li>
            <li>Customised or personalised items</li>
            <li>Items marked as final sale or non-returnable</li>
            <li>Items damaged due to misuse by the buyer</li>
          </ul>
        </Section>

        <Section icon={Clock} title="3. How to Request a Return">
          <p>To initiate a return:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1 [counter-reset:list]">
            <li>Login to your Vendly account</li>
            <li>Go to <strong>Profile → Order History</strong></li>
            <li>Find the order and click <strong>Request Return</strong></li>
            <li>Select the item and reason for return</li>
            <li>Upload photos of the item if damaged</li>
            <li>Submit your request</li>
          </ul>
          <p>
            Our team will review your request within <strong>24-48 hours</strong> and
            contact you with next steps via email.
          </p>
        </Section>

        <Section icon={Truck} title="4. Return Shipping">
          <p>
            If the return is due to a vendor error (wrong item, damaged, defective),
            the vendor will bear the cost of return shipping.
          </p>
          <p>
            If you are returning for personal reasons (change of mind), you will be
            responsible for the return shipping cost. We recommend using a trackable
            shipping service.
          </p>
        </Section>

        <Section icon={CheckCircle} title="5. Refund Process">
          <p>Once your return is received and inspected:</p>
          <ul className="list-disc pl-4 flex flex-col gap-1">
            <li>We will notify you of the approval or rejection of your refund</li>
            <li>Approved refunds are processed within <strong>3-5 business days</strong></li>
            <li>Refunds are made to your original payment method via Paystack</li>
            <li>Bank processing times may add 2-3 additional days</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-2">
            <div className="flex gap-2">
              <AlertCircle size={15} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">
                Delivery fees are non-refundable unless the return is due to our error
                or the vendor's fault.
              </p>
            </div>
          </div>
        </Section>

        <Section icon={RefreshCw} title="6. Exchanges">
          <p>
            If you need a different size, colour or variant of the same product,
            you may request an exchange instead of a refund. Exchange availability
            depends on the vendor's stock.
          </p>
          <p>
            To request an exchange, follow the same process as a return and select
            "Exchange" as your preferred resolution.
          </p>
        </Section>

        <Section icon={Phone} title="7. Contact Support">
          <p>
            If you have questions about your return or refund, our support team
            is here to help:
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mt-1 flex flex-col gap-1">
            <p><strong>Email:</strong> noreply.vendly@gmail.com</p>
            <p><strong>Phone:</strong> +234 912 088 7991</p>
            <p><strong>Hours:</strong> Monday to Friday, 8am to 6pm WAT</p>
          </div>
        </Section>

      </div>
    </div>
  )
}

export default RefundPolicyPage