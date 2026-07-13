import { useState, useEffect } from "react"
import { Cookie, X, Shield, BarChart2, Settings } from "lucide-react"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"

function CookieConsent() {
    const [visible, setVisible] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [prefs, setPrefs] = useState({
        necessary: true,
        analytics: false,
        marketing: false,
    })

    useEffect(() => {
        const consent = Cookies.get("vendly_cookie_consent")
        if (!consent) {
            setTimeout(() => setVisible(true), 1500)
        }
    }, [])

    function acceptAll() {
        Cookies.set("vendly_cookie_consent", "all", { expires: 365 })
        setVisible(false)
    }

    function acceptSelected() {
        Cookies.set("vendly_cookie_consent", JSON.stringify(prefs), { expires: 365 })
        setVisible(false)
    }

    function rejectAll() {
        Cookies.set("vendly_cookie_consent", "necessary", { expires: 365 })
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

                {/* Main Banner */}
                <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Cookie size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">We use cookies</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    We use cookies to improve your experience on Vendly. By continuing you agree to our{" "}
                                    <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                                    {" "}and{" "}
                                    <Link to="/cookies-policy" className="text-primary hover:underline">Cookie Policy</Link>.
                                </p>
                            </div>
                        </div>
                        <button onClick={rejectAll} className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Expanded Settings */}
                    {expanded && (
                        <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
                            {[
                                {
                                    key: "necessary",
                                    icon: Shield,
                                    label: "Necessary Cookies",
                                    desc: "Required for the website to function. Cannot be disabled.",
                                    locked: true,
                                },
                                {
                                    key: "analytics",
                                    icon: BarChart2,
                                    label: "Analytics Cookies",
                                    desc: "Help us understand how visitors interact with our website.",
                                    locked: false,
                                },
                                {
                                    key: "marketing",
                                    icon: Settings,
                                    label: "Marketing Cookies",
                                    desc: "Used to show you relevant ads and promotions.",
                                    locked: false,
                                },
                            ].map(({ key, icon: Icon, label, desc, locked }) => (
                                <div key={key} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Icon size={16} className="text-primary flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">{label}</p>
                                            <p className="text-xs text-gray-400">{desc}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {locked ? (
                                            <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">Always on</span>
                                        ) : (
                                            <button
                                                onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                                                className={`w-10 h-5 rounded-full transition-colors relative ${prefs[key] ? "bg-primary" : "bg-gray-300"}`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${prefs[key] ? "left-[20px]" : "left-0.5"
                                                        }`}
                                                />                      </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={acceptAll}
                            className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition"
                        >
                            Accept All
                        </button>
                        <button
                            onClick={acceptSelected}
                            className="border border-primary text-primary px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/5 transition"
                        >
                            Save Preferences
                        </button>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                        >
                            {expanded ? "Hide Settings" : "Manage Cookies"}
                        </button>
                        <button
                            onClick={rejectAll}
                            className="text-gray-400 text-sm hover:text-gray-600 transition px-2"
                        >
                            Reject all
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CookieConsent