// Hotmart checkout destinations for each plan.
window.BIBLICAL_STORE = {
  price: 19.90,
  currency: 'USD',
  checkoutUrl: 'https://pay.hotmart.com/C108120733U?sck=HOTMART_PRODUCT_PAGE&off=5m6gazt2&hotfeature=32&_gl=1*c85qb9*_gcl_aw*R0NMLjE3OTIwNzQ2MDguQ2p3S0NBanc4OEhXQmhBM0Vpd0FvMlpkNkpabjB4NXU5Q1hjNk9YTTRUblRJbVFFUkh3MHU4S2NGWVZOMlJLVHNEYWdOSmJFd3djNFpCb0M3eFVRQXZEX0J3RQ..*_gcl_au*OTU0MjQ5OTQzLjE3OTIwNzQ2MTI.*FPAU*MTY1OTAxOTU0MC4xNzkyMDc0NjEw*_ga*NzcxMTYwOTM1LjE3OTIwNzQ2MDg.*_ga_GQH2V1F11Q*czE3OTMwNTAwNTEkbzgkZzEkdDE3OTMwNTE4ODgkajE1JGwwJGgxMTUyNzU0MzEw&bid=1793051891300',
  plans: {
    basic: { price: 9.90, checkoutUrl: 'https://pay.hotmart.com/Q108120688N?sck=HOTMART_PRODUCT_PAGE&off=fhuz0umx&hotfeature=32&_gl=1*18k2xi8*_gcl_aw*R0NMLjE3OTIwNzQ2MDguQ2p3S0NBanc4OEhXQmhBM0Vpd0FvMlpkNkpabjB4NXU5Q1hjNk9YTTRUblRJbVFFUkh3MHU4S2NGWVZOMlJLVHNEYWdOSmJFd3djNFpCb0M3eFVRQXZEX0J3RQ..*_gcl_au*OTU0MjQ5OTQzLjE3OTIwNzQ2MTI.*FPAU*MTY1OTAxOTU0MC4xNzkyMDc0NjEw*_ga*NzcxMTYwOTM1LjE3OTIwNzQ2MDg.*_ga_GQH2V1F11Q*czE3OTMwNTAwNTEkbzgkZzEkdDE3OTMwNTE4NDMkajYwJGwwJGgxMTUyNzU0MzEw' },
    premium: { price: 19.90, checkoutUrl: 'https://pay.hotmart.com/C108120733U?sck=HOTMART_PRODUCT_PAGE&off=5m6gazt2&hotfeature=32&_gl=1*c85qb9*_gcl_aw*R0NMLjE3OTIwNzQ2MDguQ2p3S0NBanc4OEhXQmhBM0Vpd0FvMlpkNkpabjB4NXU5Q1hjNk9YTTRUblRJbVFFUkh3MHU4S2NGWVZOMlJLVHNEYWdOSmJFd3djNFpCb0M3eFVRQXZEX0J3RQ..*_gcl_au*OTU0MjQ5OTQzLjE3OTIwNzQ2MTI.*FPAU*MTY1OTAxOTU0MC4xNzkyMDc0NjEw*_ga*NzcxMTYwOTM1LjE3OTIwNzQ2MDg.*_ga_GQH2V1F11Q*czE3OTMwNTAwNTEkbzgkZzEkdDE3OTMwNTE4ODgkajE1JGwwJGgxMTUyNzU0MzEw&bid=1793051891300' },
    premiumSpecial: { price: 15.90, checkoutUrl: 'https://pay.hotmart.com/Q108120773T?sck=HOTMART_PRODUCT_PAGE&off=ips20a3h&hotfeature=32&_gl=1*3haho6*_gcl_aw*R0NMLjE3OTIwNzQ2MDguQ2p3S0NBanc4OEhXQmhBM0Vpd0FvMlpkNkpabjB4NXU5Q1hjNk9YTTRUblRJbVFFUkh3MHU4S2NGWVZOMlJLVHNEYWdOSmJFd3djNFpCb0M3eFVRQXZEX0J3RQ..*_gcl_au*OTU0MjQ5OTQzLjE3OTIwNzQ2MTI.*FPAU*MTY1OTAxOTU0MC4xNzkyMDc0NjEw*_ga*NzcxMTYwOTM1LjE3OTIwNzQ2MDg.*_ga_GQH2V1F11Q*czE3OTMwNTAwNTEkbzgkZzEkdDE3OTMwNTE4NjAkajQzJGwwJGgxMTUyNzU0MzEw&bid=1793051864218' }
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
