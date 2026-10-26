// Hotmart checkout destinations for each plan.
window.BIBLICAL_STORE = {
  price: 19.90,
  currency: 'USD',
  checkoutUrl: 'https://hotmart.com/es/marketplace/productos/viaje-al-mundo-biblico-3d-premium/C108120733U',
  plans: {
    basic: { price: 9.90, checkoutUrl: 'https://hotmart.com/es/marketplace/productos/viaje-al-mundo-biblico-3d-basico/Q108120688N' },
    premium: { price: 19.90, checkoutUrl: 'https://hotmart.com/es/marketplace/productos/viaje-al-mundo-biblico-3d-premium/C108120733U' },
    premiumSpecial: { price: 15.90, checkoutUrl: 'https://hotmart.com/es/marketplace/productos/viaje-al-mundo-biblico-3d-premium-descuento/Q108120773T' }
  },
  supportEmail: '',
  sellerName: '',
  termsUrl: '',
  privacyUrl: '',
  promotion: {
    // Demo previews are labelled. Set false and supply actual offer data to launch.
    demo: true,
    countdownMinutes: 14 + 13 / 60, // 14:13 per visit; restarts after reaching zero.
    remaining: null, // Actual remaining promotional allocations; never decremented randomly.
    total: null, // Total promotional allocations; percentage = (total - remaining) / total.
    regularPrice: 34,
    purchases: [] // Consented real entries: {name:'First name L.', country:'Country', purchasedAt:'ISO timestamp'}
  }
};
