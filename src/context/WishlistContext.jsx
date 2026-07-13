import { createContext, useContext, useState, useEffect } from "react"

const WishlistContext = createContext()

// Load from localStorage on startup
function loadWishlist() {
  try {
    const saved = localStorage.getItem("vendly_wishlist")
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(loadWishlist)

  // ✅ Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("vendly_wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  function addToWishlist(product) {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id)
      if (exists) return prev
      return [...prev, product]
    })
  }

  function removeFromWishlist(productId) {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId))
  }

  function toggleWishlist(product) {
    const exists = wishlistItems.find((item) => item._id === product._id)
    if (exists) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  function isWishlisted(productId) {
    return wishlistItems.some((item) => item._id === productId)
  }

  const wishlistCount = wishlistItems.length

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      wishlistCount,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}