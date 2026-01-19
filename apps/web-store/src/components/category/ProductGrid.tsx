
import { Heart, Leaf } from "lucide-react";

const products = [
  {
    id: 1,
    brand: "AETERNA",
    name: "Structured Wool Oversized Coat",
    price: "$1,250.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUg0q-DMCwkBkBcPaPX8WfSqb_cF2iZSp3kRUZqGoLcUsN0n9wuMGCohfyJc96V698FTYCbFu8s0Z-iYLexcE6UWWpDOyXZ37UEO75KVbQX21_b5g78gET1e3oUMCZrWyWTIJhqg9iqMZXXd-l9uRG0mv1QHVWC-pYJCt68V7xUJeRpFGTEVK6bVUeD3KV8K9X6lCiurYoDB7Mxo4-A2M8tfrRp500epu9MqvZFmUbYWarlj4CJUnG1mUo5w62wMI79Dk8vF1IE6c",
    hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuApJKkhJ4WTmpbKA8NHr5PXrD6jxv-JpfuM5gpPW1KXUto_7utbgWjjjxrPv2Hb6IjAQBsqiCPlWZdTFW2Yxop06B504EvaVGxUhRTHyleAgaxDkF9gUka1BiOuePpKyNYhjyJpLvTHebctkbRuz2EYy_yaBtt16_DfeETW6hkwSHcFgzc6VUd2vXXiMY5prUvf0mFTNbZQMMaPPshv-yNMvdu3blwDqMEwUxWV8FvXuqJXw2aaANVpQDXe2LmIf3yPw5qnmAf5Seo"
  },
  {
    id: 2,
    brand: "MODERNIST",
    name: "Minimalist Silk Midi Dress",
    price: "$890.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4t-b6sDt7g4phqyq-hj1DfPl03kjvMT0VfL3wFKEBwytvtD-Qx-XjitW-bR3nv7gv5B5xHjhgx2wQOXv7lLVCAxKmCrPwsy473XS4Fvb2AjgydpBQ6XOO0aY74nRXaFfTFGwDaV0L2a9tMaN0LbJbmAkvjzbV_nmb4xhVuhD3ZZNM1H8Chofhm0DHix83pYtxKOlyQJXXcIZ0IXcMt6H4ljKW2_oy1yJckbovouK8GZ9r4_AA4Pu8PC_6NTTnnGHnubq_DCAgnXA",
    hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3wZAuuxzzaEBerQCbOlaiqFxiIgHib8yRNH7Z1JOO9FeYDIE0sG03UWAxlyfhv12ovV9SY4L29guSx_svH2eRCeHnApOb385y2c1EH3RUnaIHVuP2jYyMahumTHjdecVebP8Mz_2MNFw4d-5aLIU7C-OF3BS_MEr7lI_tcLCqabe6FtPqcyMu3DJLwg-ckpwb2BmqWzYExxHvmiC_8EAEm34jFLveHe6zuy7PdWP9HYBO_ZxF39YAtJ2bXnfI1NKRV1l1kEFQk",
    badge: "New"
  },
  {
    id: 3,
    brand: "ECO-SOUL",
    name: "Architectural Cashmere Sweater",
    price: "$540.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOHclFjY8fzuO1lSKtF19ngiz5fqmfRu7XDDIaXIH4Rc0VG-XYhbUVnb8FN0b61ajPxL1bx3K6zfg-Y9gaL2QjFLv5FyKAdo4uhOH_geK3fTJw1JfG4PUHORMc4qXKZtsl7oM_3J2-ObHXk3Fc-HM7itNxxKe8qVhIpf-gd46JUHJOMFNiR-JWgd8nRdVzuRFaYBu6MDywQf9Qa7mtMyo9-_oA_BfGJsyYByzbLROki3pt-3saWGmMHSZ_FnuHkKaBkZM_t8LNJno",
    hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgChQ_7wX761gmyEenQcAvoZeDi_O1YFettia85WdzP6LCbrTLKR9ccMysghwCNH3m0imAKm4LFIVqzt0rwWsUxxe94zgFm7YOByUuVWRD6WQGBql3-ZrB4d8CbyEGPnIjLQ8B7cubh9RcJ1JjPyzX56nekezjK4xnwaLn32StDZ33SW5J3xicI0RKgkVw-vL1fNNMfxT9BrHZgCjn8p7q7lAjbvq9OT4eQyANsO6oTKZBLSAeuLSoietYDx6dOqRlt6GZN1D63Q0",
    eco: true
  },
  {
    id: 4,
    brand: "VEGAN LUX",
    name: "Asymmetric Vegan Leather Skirt",
    price: "$420.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLyj_Sn98T2kgeV4H_LkjGCn24b81rzSnAYRlutOrlzx_t4odqg_997Sq2eU-mleUSlg5-ejwB0yL94AL2Na2SEF2QNmMLHXEX7vvCyyyZ3fbvKDRNxkpLP-E-H1axQeAoDMabTgpJjJHZxO_TjKJsQmHitwmt2xlLtQFk3F8qFYFn94LKKioqDY1r28pJj_yW4W3AgDGwqSoJNtdgRJg5zpPXtCzZHgGmYH2liS8W37uB0MEYwC9ErSCYWVPqgL3ep0qRPM9S6BU",
    hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuANMmezJ07X62S93rtBPckrxhbJ_r9Td7IRc_aiMnKyvrDKfWjqA3nEldOV1HBl2BUNTSOhZ4kNmT5-FrrlwlhjUvO-YdOFovVYCLobqVAp4g-CisIWY7X1GyLgf1NthFA0joXaEMBIg-pNfg66uMbevCpKmkyMKdbdYDUMqXnoCelgdbaO4VjhxXVIewBhLvUVufZEUNfDbTTsR0h7KZ67CkUvK-Z6230ii7o1q0nWaxyNaYlUOmSSTNWNam3ebB1XwS7SISPoX-w"
  },
  {
    id: 5,
    brand: "ESSENTIA",
    name: "High-Waist Wide Leg Trousers",
    price: "$380.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPuVCzIT4NSON37iHFwIVkbOOk78CLl7ODjKRFec3zxcQ9sKakOHMUoaDBAFCaPTi1-PI2FXu0WEL4YHbNkPhRw0NuvPkZlZ_UD_cFAQgWZp-pWhUIWv7g_dKVIAlaGLoKO1dJ0KOHYWqRvie27VdGll-PZzWo_r_PtJ9lPo3Yws9cuKhCKtLHbACuT6zyKSvRxm0_NNJT8Cs46WGIHUOaai2FWu-Io1JcCPtDiVaL3u94Jd2EydBlVXep0BvRw12x2_Y_he7cB3o",
    hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQWvND9n4HjVpjg6EpLQ0lWOEXlU6q6G7nmcrACFRiShEA0BYj4d0iQhTARsgKVTByzO5LrMQ7eJSWE3qksJQ0h7epDZA1uzP-TSu-uAt0pAkDqn3vFjYe1E94z_jATPP-Wck7WTCpMXTbVXOr_UXh31w6otnlEUBYIpZ11A1CPqy8wfPW61HqUhE_DdZwEQX01zpU_Y2EbjFznIv6YW5YMvGZ0OL9PrVpxplxmTgIFPQCXs29omz5hVnhmvyBAhjDt8jxC_EYp1A"
  },
  {
    id: 6,
    brand: "ORUM",
    name: "Sculptural Form Silver Earrings",
    price: "$215.00",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUYNb1ieEIZ5vqOzzG0BqRtTF5yt32cJff1ZLiaA4_uyASpc9374Gp0ME3AgHTLGBGInBNZFGpGl5aCP_fyy1TXMmtG52bIwvu5YDfdB3Vsm6vMOkmEtlBNSsbDkB_ZQYDydcCwFPe-W8bT8NqXN1NFYXY6wS4O0odvaDYWH01sSS2awOiq56Re8KXD5VPSkXX6RkIMiCeVQz4DBCRPRBoAkY-r01Ecm_xtOUjN03Fn6u8_qiGtUalwFgowBvc4cYU75qGVvzZEvs",
    hoverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC826poXmpAcC_pffWzaLueyM8DGBadTH539avU9JYIIyINS2fwJOMxrBurDhryjMEWjpumlZnKzs-0oEXSw0g1TbMXx2XQCD9dtHkim9WbmifBVF6KDokpBo72VQ0-u3c1_p2d4PdRv2z-tPQQ0z7GrrOgLVNgHQtKw_7nebZbxdoLp6s6pZWcWlFIK5Y5412jXrTCgA-jHWVLzA3-QXyC-HVRoMUA-Oy62ra6ar6lNRaoB2sJ4XsqkmXe4c1HpnFoWJW_hu_2cG8"
  }
];

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
      {products.map((product) => (
        <div key={product.id} className="product-card group cursor-pointer">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#f1f3f3] mb-4">
            <img 
              className="h-full w-full object-cover" 
              src={product.image} 
              alt={product.name}
            />
            <img 
              className="hover-image absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
              src={product.hoverImage} 
              alt={`${product.name} alternate view`}
            />
            {product.badge && (
               <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">{product.badge}</div>
            )}
            <button className="absolute bottom-4 left-4 right-4 bg-white/90 py-3 text-xs font-bold uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white">
              Quick Add
            </button>
            <button className="absolute top-4 right-4 text-white hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-tighter text-[#6c7a7f]">{product.brand}</p>
            <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
            <div className="flex items-center gap-2">
               <p className="text-sm font-light">{product.price}</p>
               {product.eco && <Leaf className="w-4 h-4 text-green-600" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
