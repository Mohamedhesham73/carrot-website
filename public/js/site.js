// public/js/site.js
window.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({
      once: false,   // animate every time you scroll back
      mirror: true,  // animate out on scroll past
      duration: 700,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }
});

module.exports = {
  pricingPacks: [
    {
      slug: 'social',
      name: 'Social Media',
      price: 7000,
      unit: 'EGP / mo',
      bullets: [
        '12–16 posts (static/reels) + captions',
        'Monthly content calendar + hooks',
        'Community management (DMs/comments)',
        'Basic motion graphics & story sets',
        'Monthly report: reach, saves, CPT'
      ]
    },
    {
      slug: 'websites',
      name: 'Websites',
      price: 9000,
      unit: 'EGP from',
      bullets: [
        'Business site (3–6 pages) with CMS',
        'Responsive UX + performance budget',
        'On-page SEO & analytics setup',
        'Contact forms + email routing',
        '1 month post-launch support'
      ]
    },
    {
      slug: 'ads',
      name: 'Google Ads',
      price: 8000,
      unit: 'EGP / mo',
      bullets: [
        'Search + Performance Max setup',
        'Keyword mapping & negative lists',
        'Offer/landing page alignment',
        'Weekly optimizations (bids, SQs)',
        'ROAS & CAC reporting'
      ]
    },
    {
      slug: 'designs',
      name: 'Designs',
      price: 2000,
      unit: 'EGP from',
      bullets: [
        'Brand kits: logo, palette, type',
        'Social templates (Canva/PSD)',
        'Ad creatives (static & motion)',
        'Pitch decks & one-pagers',
        'Up to 2 revisions / asset'
      ]
    },
    {
      slug: 'reels',
      name: 'Reels',
      price: 500,
      unit: 'EGP per reel',
      bullets: [
        'Hook scripting + shot list',
        'Edit (9:16), captions, SFX, music',
        'Thumbnail & CTA screens',
        'Platform-native exports',
        'Delivery within 48–72h'
      ]
    },
    {
      slug: 'seo',
      name: 'SEO',
      price: 6000,
      unit: 'EGP / mo',
      bullets: [
        'Technical audit & fixes (Core Web Vitals)',
        'Keyword clusters & content briefs',
        'On-page optimization (meta/IA)',
        'Internal linking & schema',
        'Monthly growth report'
      ]
    }
  ],

  portfolio: [
    // Fill with your real items as you collect them
    { id:'p01', title:'Handeal — Marketplace SEO Lift', cat:'SEO',
      img:'/img/portfolio/handeal-seo.jpg',
      link:'https://handeal.example/case', tags:['content','technical','growth'] },
    { id:'p02', title:'SHENO — Performance Ads', cat:'ADS',
      img:'/img/portfolio/sheno-ads.jpg',
      link:'https://sheno.example/case', tags:['pmax','creative','retargeting'] },
    { id:'p03', title:'MLAMEH — Social System', cat:'SMM',
      img:'/img/portfolio/mlameh-smm.jpg',
      link:'https://mlameh.example/case', tags:['reels','calendar','community'] },
    { id:'p04', title:'Carrot — Landing System', cat:'WEB',
      img:'/img/portfolio/carrotagency-web.jpg',
      link:'https://carrot.example', tags:['express','ejs','bootstrap'] }
  ]
};
