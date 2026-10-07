/* SwanPass redesign mockup — sample data.
   Listings were captured from swanpass.com on 6 Oct 2026 (name, photo, category, city, rating, deal).
   Areas, coordinates, prices and hours are filled in deterministically for the mockup only. */

const IMG = 'https://images.swanpass.com/uploads/';

const COUNTRIES = [
  { code: 'th', name: 'Thailand', flag: '🇹🇭', count: 649, currency: '฿' },
  { code: 'vn', name: 'Vietnam', flag: '🇻🇳', count: 160, currency: '₫' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩', count: 71, currency: 'Rp' },
  { code: 'kh', name: 'Cambodia', flag: '🇰🇭', count: 25, currency: '$' },
  { code: 'my', name: 'Malaysia', flag: '🇲🇾', count: 12, currency: 'RM' },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬', count: 20, currency: 'S$' },
  { code: 'ph', name: 'Philippines', flag: '🇵🇭', count: 0, soon: true },
  { code: 'jp', name: 'Japan', flag: '🇯🇵', count: 0, soon: true },
  { code: 'hk', name: 'Hong Kong', flag: '🇭🇰', count: 0, soon: true },
  { code: 'mo', name: 'Macau', flag: '🇲🇴', count: 0, soon: true },
];

const CITIES = [
  { slug: 'bangkok', name: 'Bangkok', country: 'th', count: 389, deals: 36, img: IMG + 'region/image/1/bangkok-bg.webp', lat: 13.7367, lng: 100.5602, hook: 'The widest scene in Asia — Sukhumvit, Nana, Cowboy, Ratchada soapies.' },
  { slug: 'pattaya', name: 'Pattaya', country: 'th', count: 145, deals: 4, img: IMG + 'region/image/3/pattaya-bg.webp', lat: 12.9276, lng: 100.8771, hook: 'The densest go-go strip in the country, plus Soi 6 and Walking Street.' },
  { slug: 'chiang-mai', name: 'Chiang Mai', country: 'th', count: 41, deals: 0, img: IMG + 'region/image/2/chiang-mai-bg.webp', lat: 18.7883, lng: 98.9853, hook: 'Smaller and relaxed — Loi Kroh bars and old-town massage.' },
  { slug: 'phuket', name: 'Phuket', country: 'th', count: 23, deals: 0, img: IMG + 'region/image/4/phuket-bg.webp', lat: 7.8964, lng: 98.2965, hook: 'Bangla Road anchors a beach-town scene in Patong.' },
  { slug: 'khon-kaen', name: 'Khon Kaen', country: 'th', count: 10, img: IMG + 'region/image/14/Khon_Kaen_City_from_Above.jpg' },
  { slug: 'ko-samui', name: 'Ko Samui', country: 'th', count: 8, img: IMG + 'region/image/5/samui.jpeg' },
  { slug: 'hua-hin', name: 'Hua Hin', country: 'th', count: 8, img: IMG + 'region/image/25/Hua_Hin_1.jpg' },
  { slug: 'korat', name: 'Korat', country: 'th', count: 7, img: IMG + 'region/image/15/Square_-_panoramio__8_.jpg' },
  { slug: 'udon-thani', name: 'Udon Thani', country: 'th', count: 5, img: IMG + 'region/image/6/Samlors_in_Udon_Thani.jpg' },
  { slug: 'phitsanulok', name: 'Phitsanulok', country: 'th', count: 4 },
  { slug: 'krabi', name: 'Krabi', country: 'th', count: 3 },
  { slug: 'ubon-ratchathani', name: 'Ubon Ratchathani', country: 'th', count: 3 },
  { slug: 'sri-racha', name: 'Sri Racha', country: 'th', count: 1 },
  { slug: 'kanchanaburi', name: 'Kanchanaburi', country: 'th', count: 1 },
  { slug: 'ratchaburi', name: 'Ratchaburi', country: 'th', count: 1 },
  { slug: 'ho-chi-minh-city', name: 'Ho Chi Minh City', country: 'vn', count: 125, img: IMG + 'region/image/27/Ho_Chi_Minh_city__39514086172_.jpg', lat: 10.7769, lng: 106.7009, hook: 'Massage clubs spread across District 1, 3 and Gò Vấp.' },
  { slug: 'hanoi', name: 'Hanoi', country: 'vn', count: 35, img: IMG + 'region/image/28/Hanoi_Skyline_-_NKS.jpg', lat: 21.0278, lng: 105.8342, hook: 'Spa-and-karaoke culture around Ba Đình and Đống Đa.' },
  { slug: 'jakarta', name: 'Jakarta', country: 'id', count: 30, img: IMG + 'region/image/32/Jakarta_Skyline_Part_2.jpg', lat: -6.2088, lng: 106.8456 },
  { slug: 'bali', name: 'Bali', country: 'id', count: 29, img: IMG + 'region/image/31/Bali__Indonesia__50368691146_.jpg', lat: -8.6705, lng: 115.2126, hook: 'Spa outcalls and Seminyak clubs.' },
  { slug: 'batam', name: 'Batam', country: 'id', count: 6, img: IMG + 'region/image/35/batam.jpg' },
  { slug: 'surabaya', name: 'Surabaya', country: 'id', count: 6 },
  { slug: 'phnom-penh', name: 'Phnom Penh', country: 'kh', count: 25, img: IMG + 'region/image/36/Phnom_Penh.jpeg', lat: 11.5564, lng: 104.9282, hook: 'Riverside bars and Street 136.' },
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'my', count: 12, img: IMG + 'region/image/33/images.jpeg', lat: 3.139, lng: 101.6869 },
  { slug: 'singapore', name: 'Singapore', country: 'sg', count: 20, img: IMG + 'region/image/37/singapore.jpg', lat: 1.3521, lng: 103.8198, hook: 'Orchard Towers and Geylang.' },
];

const AREAS = {
  bangkok: [
    { slug: 'phrom-phong', name: 'Phrom Phong', type: 'Massage', blurb: 'Sukhumvit 24–39 — the densest cluster of Japanese-style nuru parlours.', lat: 13.7305, lng: 100.5697, weight: 5 },
    { slug: 'asok', name: 'Asok', type: 'Mixed', blurb: 'Interchange hub: Soi Cowboy, Terminal 21 and late massage on Soi 23.', lat: 13.7376, lng: 100.5615, weight: 3 },
    { slug: 'nana', name: 'Nana', type: 'Go-Go', blurb: 'Nana Plaza’s three floors of bars, off lower Sukhumvit.', lat: 13.7405, lng: 100.5550, weight: 2 },
    { slug: 'huai-khwang', name: 'Huai Khwang', type: 'Soapy', blurb: 'Ratchada’s big soapy palaces and dawn-closing clubs.', lat: 13.7700, lng: 100.5730, weight: 2 },
    { slug: 'thonglor', name: 'Thonglor', type: 'KTV', blurb: 'Upscale KTV lounges and members’ bars for a younger, local crowd.', lat: 13.7310, lng: 100.5830, weight: 1 },
    { slug: 'ekkamai', name: 'Ekkamai', type: 'Massage', blurb: 'Quieter boutique spas a soi or two past Thonglor.', lat: 13.7200, lng: 100.5850, weight: 1 },
    { slug: 'patpong', name: 'Patpong', type: 'Mixed', blurb: 'The old-school original in Silom — night market down the middle.', lat: 13.7290, lng: 100.5330, weight: 1 },
    { slug: 'phra-khanong', name: 'Phra Khanong', type: 'Massage', blurb: 'Local-priced massage around On Nut and Sukhumvit 71.', lat: 13.7150, lng: 100.5950, weight: 1 },
  ],
  pattaya: [
    { slug: 'soi-6', name: 'Soi 6', type: 'Bars', blurb: 'Short-time bars shoulder to shoulder — busiest in the afternoon.', lat: 12.9440, lng: 100.8870 },
    { slug: 'walking-street', name: 'Walking Street', type: 'Go-Go', blurb: 'The neon mile — go-go clubs, discos and touts.', lat: 12.9268, lng: 100.8730 },
    { slug: 'lk-metro', name: 'LK Metro', type: 'Go-Go', blurb: 'Smaller, friendlier go-go L-shape off Soi Buakhao.', lat: 12.9320, lng: 100.8820 },
  ],
};

const CATEGORIES = [
  { slug: 'massage', name: 'Massage', icon: 'spa' },
  { slug: 'soapy', name: 'Soapy', icon: 'bath' },
  { slug: 'go-go', name: 'Go-Go & Strip', icon: 'spark' },
  { slug: 'gentlemens-clubs', name: "Gentlemen's Clubs", icon: 'glass' },
  { slug: 'red-light', name: 'Red Light Districts', icon: 'pin' },
  { slug: 'freelancers', name: 'Freelancers', icon: 'heart' },
  { slug: 'ktv', name: 'KTV / Karaoke', icon: 'mic' },
  { slug: 'lgbtq', name: 'LGBTQ+', icon: 'rainbow', isNew: true },
];

const CAT_BY_LABEL = { 'Massage': 'massage', 'Soapy': 'soapy', 'Go-Go & Strip': 'go-go', 'Gentlemen’s Clubs': 'gentlemens-clubs', 'Red Light Districts': 'red-light', 'Freelancers': 'freelancers' };

// [slug, name, image, category, city, rating, reviews, featured, verified, new, deal]
const RAW = [["don-quixote","Don Quixote","photo/image/16062/5693.jpg","Massage","Bangkok",4.3,"7K+",1,1,0,"Free jacuzzi"],["666-class","666 Class","photo/image/14215/666-class.jpeg","Massage","Bangkok",4.6,"3K+",1,1,0,"Free jacuzzi"],["amor888","AMOR888","photo/image/14212/amor888.jpeg","Massage","Bangkok",4.7,"3K+",1,1,0,"Free jacuzzi"],["the333-bangkok","The333","photo/image/15494/2024-08-28-1.jpg","Massage","Bangkok",4.9,"3K+",1,1,0,"Free jacuzzi"],["body-bliss","Body Bliss (Outcall)","https://images.swanpass.com/wp-content/uploads/2023/01/Home-Banner-Edit-640x427.webp","Massage","Bangkok",5,"2K+",1,1,0,"Save ฿200"],["chairman-nuru-massage-bangkok","Chairman Nuru Massage","photo/image/14214/chairman-nuru.jpeg","Massage","Bangkok",5,"2K+",1,1,0,"Free jacuzzi"],["g2g-massage-bangkok","G2G Massage","photo/image/14216/g2g-massage.jpeg","Massage","Bangkok",5,"1K+",1,1,0,"Free jacuzzi"],["exotic-massage-bangkok-bangkok","Exotic Massage Bangkok","photo/image/12049/2024-08-16-1.jpg","Massage","Bangkok",5,"1K+",1,1,0,"Save ฿200"],["cube-massage-bangkok","Cube Massage","photo/image/16094/WhatsApp_Image_2026-06-26_at_19.13.13.jpeg","Massage","Bangkok",5,"1K+",1,1,0,"Free jacuzzi"],["jspot-bangkok","JSpot","photo/image/14639/S__6889528.jpg","Massage","Bangkok",5,"1K+",1,1,0,"Free jacuzzi"],["sento-bangkok-bangkok","Sento Bangkok","photo/image/14655/Logo.jpg","Massage","Bangkok",4.9,"7K+",1,1,0,"฿200 off all services"],["nomo22-bangkok","Nomo22","photo/image/15418/IMG_6647.png","Massage","Bangkok",5,"7K+",1,1,0,"฿500 off 2-girl courses"],["drake-luxury-lounge-bangkok","DRAKE Luxury Lounge","photo/image/15250/WhatsApp_Image_2026-02-23_at_16.12.33.webp","Massage","Bangkok",5,"7K+",1,1,0,"฿300 off karaoke"],["jelly-pop-bangkok","Jelly Pop","photo/image/15477/IMG_6834.JPG","Massage","Bangkok",5,"6K+",1,1,1,"Free jacuzzi"],["boss-nuru-massage-20-bangkok","BOSS Nuru Massage 20","photo/image/15747/Screenshot_2026-05-20_at_9.28.46_AM.jpg","Massage","Bangkok",4.6,"4K+",1,1,1,"฿200 off Nuru + Jacuzzi"],["the-sense-bangkok","The Sense Bangkok","photo/image/15513/S__9011206_0.jpg","Massage","Bangkok",5,"3K+",1,1,0,"฿200 off all services"],["dna-massage-bangkok","DNA Massage","photo/image/14815/61b8d3_f421ddf7472c4525b275975811359b47_mv2.avif","Massage","Bangkok",4.9,"3K+",1,1,0,"Free jacuzzi"],["boss-nuru-massage-33-bangkok","BOSS Nuru Massage 33","photo/image/15749/Screenshot_2026-05-20_at_9.28.03_AM.jpg","Massage","Bangkok",4.6,"2K+",1,1,1,"฿200 off Nuru + Jacuzzi"],["rina-nuru-massage-bangkok","Rina Nuru Massage","photo/image/15864/S__10543130_0.jpg","Massage","Bangkok",4.8,"1K+",1,1,1,"฿200 off + free stockings"],["lucky-cat-bkk-bangkok","Lucky Cat BKK","photo/image/17483/IMG_3714.JPG","Massage","Bangkok",4.9,"500+",1,1,1,"Save ฿200"],["luxe-nuru-massage-bangkok","Luxe Nuru Massage","photo/image/16096/1000006485.jpg","Massage","Bangkok",5,"2K+",0,0,1,""],["the-pixies-bangkok","The Pixies","photo/image/16038/store02.jpg","Massage","Bangkok",4.1,"2K+",0,0,1,""],["airi-nuru-exclusive-spa-bangkok","Airi Nuru Exclusive Spa","photo/image/16057/70f0fd11-c790-430d-a8ef-6d24eb11eabd-768x1024.jpg","Massage","Bangkok",4.8,"2K+",0,0,1,""],["top-joy-paradise-bangkok","Top Joy Paradise","photo/image/16289/unnamed-_1_.jpg","Massage","Bangkok",4.8,"2K+",0,0,1,""],["vivi-nuru-bangkok","Vivi Nuru","photo/image/16311/gallery-2.jpg","Massage","Bangkok",4.7,"2K+",0,0,1,""],["canary-massage-bangkok-bangkok","Canary Massage Bangkok","photo/image/16156/Screenshot_2026-07-12_at_4.00.56_PM.jpg","Massage","Bangkok",4.7,"1K+",0,0,1,""],["8-fantasy-bangkok","8 Fantasy","photo/image/16602/81.jpg","Massage","Bangkok",4.8,"1K+",0,0,1,""],["fin69-nuru-massage-bkk-bangkok","Fin69 Nuru Massage","photo/image/16310/hero.jpg","Massage","Bangkok",4.9,"1K+",0,0,0,""],["kizuna-saki-bangkok","Kizuna Saki","photo/image/16354/line_oa_chat_260124_195515.jpg","Massage","Bangkok",4.9,"1K+",0,0,0,""],["canary-massage-pattaya-pattaya","Canary Massage Pattaya","photo/image/16218/gallery-0.jpg","Massage","Pattaya",4.7,"800+",0,0,1,""],["yihongyuan-spa-pattaya","Yihongyuan Spa","photo/image/16273/hero.jpg","Massage","Pattaya",0,"700+",0,0,0,""],["pattaya-vice-massage-pattaya","Pattaya Vice Massage","photo/image/16326/unnamed.webp","Soapy","Pattaya",4.7,"700+",0,0,1,""],["sukebe-nuru-massage-bangkok","Sukebe Nuru Massage","photo/image/16870/hero.webp","Massage","Bangkok",4.9,"600+",0,0,0,""],["soi-33-roots-bangkok","Soi 33 Roots","photo/image/16656/HO7z-yyaEAAvrm3.jpg","Massage","Bangkok",4.9,"500+",0,0,0,""],["ten-massage-bangkok-bangkok","TEN Massage Bangkok","photo/image/16873/hero.webp","Massage","Bangkok",4.7,"500+",0,0,0,""],["elle-massage-bangkok","Elle Massage","photo/image/16630/3.jpg","Massage","Bangkok",5,"500+",0,0,0,""],["lantingxu-spa-pattaya","Lantingxu Spa","photo/image/16239/unnamed.jpg","Massage","Pattaya",4.4,"500+",0,0,0,""],["red-house-nuru-massage-bangkok","Red House Nuru Massage","photo/image/16862/gallery-1.webp","Massage","Bangkok",4.9,"100+",0,0,0,""],["kevin-s-ho-chi-minh-city","Kevin's","photo/image/17320/col-portrait-1200x1600-1of3.jpg","Massage","Ho Chi Minh City",4.9,"100+",0,0,1,""],["back-spa-massage-bangkok","Back Spa & Massage","photo/image/16761/hero.webp","Massage","Bangkok",4.6,"100+",0,0,0,""],["lucky-cat-massage-bangkok","Lucky Cat Massage","photo/image/16900/1784451891917-h18uzo6ocqo.webp","Massage","Bangkok",4.9,"100+",0,0,0,""],["24-massage-bangkok","@24 Massage","photo/image/16748/hero.webp","Massage","Bangkok",5,"100+",0,0,0,""],["eden-massage-eden-garden-bangkok","Eden Massage Eden Garden","photo/image/16831/hero.webp","Massage","Bangkok",4.4,"100+",0,0,0,""],["fox33-massage-bangkok","FOX33 Massage","photo/image/16913/hero.webp","Massage","Bangkok",4.5,"100+",0,0,0,""],["sena-nuru-massage-bangkok","Sena Nuru Massage 千愛","photo/image/16895/hero.webp","Massage","Bangkok",4.6,"100+",0,0,0,""],["queenmarich-massage-bangkok","Queenmarich Massage","photo/image/16861/hero.webp","Massage","Bangkok",4.7,"100+",0,0,0,""],["airy-massage-bangkok","Airy Massage","photo/image/16755/hero.webp","Massage","Bangkok",5,"100+",0,0,0,""],["lumi-nuru-massage-ktv-bangkok","Lumi Nuru Massage & KTV","photo/image/16901/1783403443756-pt42decm84s.webp","Gentlemen’s Clubs","Bangkok",5,"100+",0,0,0,""],["a5-massage-bangkok","A5 Massage","photo/image/16874/1781616511721-v9je7skfjyf.webp","Massage","Bangkok",4.5,"100+",0,0,0,""],["divata-outcall-bali","Divata — Outcall","photo/image/17459/Divata-brand-logo.jpg","Massage","Bali",5,"100+",0,0,1,""],["kinbi-nuru-massage-pattaya","KINBI Nuru Massage","photo/image/16907/hero.webp","Massage","Pattaya",4.8,"100+",0,0,0,""],["finmen-nuru-massage-bangkok","FinMen Nuru Massage","photo/image/16842/1778861841467-vb2sx5oecpj.webp","Massage","Bangkok",5,"100+",0,0,0,""],["emu-massage-bangkok","Emu Massage","photo/image/16840/hero.webp","Massage","Bangkok",4.6,"100+",0,0,0,""],["serenity-house-massage-chiang-mai","Serenity House Massage","photo/image/17313/serenity-house-massage-chiangmai-facilities-1.jpg","Massage","Chiang Mai",5,"100+",0,0,1,""],["timely-rain-massage-pattaya","Timely Rain Massage","photo/image/16921/hero.webp","Massage","Pattaya",4.3,"100+",0,0,0,""],["soi8-nuru-massage-pattaya","Soi8 Nuru Massage","photo/image/16914/1783435441402-1262ic7a256p.webp","Massage","Pattaya",4.7,"100+",0,0,0,""],["88-massage-and-spa-pattaya","88 Massage and Spa","photo/image/16752/hero.webp","Massage","Pattaya",4.6,"100+",0,0,0,""],["boofies-pattaya","Boofies","photo/image/16814/hero.webp","Gentlemen’s Clubs","Pattaya",4.4,"100+",0,0,0,""],["near-nuru-massage-bangkok","Near Nuru Massage","photo/image/16891/hero.webp","Massage","Bangkok",5,"100+",0,0,0,""],["hoho-massage-pattaya","Hoho Massage","photo/image/16836/hero.webp","Massage","Pattaya",4.2,"100+",0,0,0,""],["89-adult-show-pattaya","89 Adult Show","photo/image/16956/1777624770060-dpxb3was85t.webp","Gentlemen’s Clubs","Pattaya",4.2,"100+",0,0,0,""],["007-club-pattaya-pattaya","007 Club Pattaya","photo/image/16727/hero.webp","Red Light Districts","Pattaya",4,"100+",0,0,0,""],["69-adult-show-pattaya","69 Adult Show","photo/image/16954/1777607177264-lv23uetrepb.webp","Gentlemen’s Clubs","Pattaya",4.4,"100+",0,0,0,""],["bandits-hideout-pattaya","Bandits Hideout","photo/image/17007/hero.webp","Gentlemen’s Clubs","Pattaya",4.2,"100+",0,0,0,""],["club-panda-pattaya","Club Panda","photo/image/17104/hero.webp","Gentlemen’s Clubs","Pattaya",3.6,"100+",0,0,0,""],["nuru-spa-pattaya-pattaya","Nuru Spa Pattaya","photo/image/17335/hero.webp","Massage","Pattaya",4.7,"100+",0,0,0,""],["chick-gogo-club-pattaya","Chick Gogo Club","photo/image/17025/hero.webp","Go-Go & Strip","Pattaya",4.7,"100+",0,0,0,""],["dara-massage-phuket-phuket","One Dara Massage","photo/image/17590/1000256068.jpg","Massage","Phuket",5,"100+",0,0,0,""],["katoeys-are-us-pattaya","Katoeys Are Us","photo/image/17188/hero.webp","Go-Go & Strip","Pattaya",4.5,"100+",0,0,0,""],["showgirls-bar-pattaya","Showgirls Bar","photo/image/17548/hero.webp","Gentlemen’s Clubs","Pattaya",4,"100+",0,0,0,""],["orion-sauna-pattaya","Orion Sauna","photo/image/17424/hero.webp","Soapy","Pattaya",3.5,"100+",0,0,0,""],["las-vegas-agogo-club-pattaya","Las Vegas Agogo Club","photo/image/17227/hero.webp","Go-Go & Strip","Pattaya",4.6,"100+",0,0,0,""],["liquid-bar-pattaya","Liquid Bar","photo/image/17241/hero.webp","Gentlemen’s Clubs","Pattaya",4,"100+",0,0,0,""],["elysium-bar-pattaya","Elysium Bar","photo/image/17138/1783955260499-x7t864x1x3.webp","Gentlemen’s Clubs","Pattaya",5,"100+",0,0,0,""],["kink-pattaya-pattaya","KINK Pattaya","photo/image/17207/hero.webp","Go-Go & Strip","Pattaya",3.4,"100+",0,0,0,""],["cydonia-bar-pattaya","Cydonia Bar","photo/image/17115/1783771548667-cv3mlrpndr4.webp","Gentlemen’s Clubs","Pattaya",4.4,"100+",0,0,0,""],["desire-bar-pattaya","Desire Bar","photo/image/17119/hero.webp","Gentlemen’s Clubs","Pattaya",4.5,"100+",0,0,0,""],["gold-bar-pattaya","Gold Bar","photo/image/17176/hero.webp","Gentlemen’s Clubs","Pattaya",4.6,"100+",0,0,0,""],["lucifer-club-pattaya","Lucifer Club","photo/image/17289/hero.webp","Gentlemen’s Clubs","Pattaya",5,"100+",0,0,0,""],["dragon-agogo-club-pattaya","Dragon Agogo Club","photo/image/17157/hero.webp","Go-Go & Strip","Pattaya",4.4,"100+",0,0,0,""],["awesome999-bangkok","Awesome999","photo/image/14213/awesome999.jpeg","Soapy","Bangkok",4.8,"80",0,1,0,"Free jacuzzi"],["momo","Momo","photo/image/14385/0-momo-9.webp","Massage","Bangkok",3.9,"60",0,0,0,"Save ฿200–500"],["a-beautiful-day-bangkok","A Beautiful Day","photo/image/11801/2024-07-01.jpg","Massage","Bangkok",5,"40",0,0,0,"Save ฿200"],["kawaii-nuru-massage","Kawaii Nuru Massage","photo/image/2814/photo_2566-07-18-16.02.34.jpeg","Massage","Bangkok",4.3,"30",0,0,0,"Save ฿100"],["nhac-duong-lau-spa-hanoi","Nhạc Dương Lầu Spa & Massage Club","photo/image/10852/361193612_667607032051619_7036663114104460565_n.jpg","Massage","Hanoi",4.2,"46",0,0,0,""],["massage-blue-spa-hanoi","Massage Blue Spa","photo/image/11082/MASSAGE-BLUE-SPA-1-1.jpg","Massage","Hanoi",4.9,"341",1,1,0,"10% off first visit"],["ky-anh-massage-hanoi","Ky Anh Massage & Spa","photo/image/10907/339689861_782902742985693_7652563293763323536_n.jpg","Massage","Hanoi",4.2,"33",0,0,0,""],["massage-bach-kim-hcmc","Massage Bach Kim","photo/image/10728/z1045750876998_1f1613b019789766fac3a5ce14ca4872-1024x659.jpg","Massage","Ho Chi Minh City",4.9,"20",0,1,0,""],["dubai-luxury-massage-hcmc","Dubai Luxury Massage","photo/image/5795/gioi-thieu-du-bai-luxury-1-1.jpg","Massage","Ho Chi Minh City",4.2,"113",1,1,0,"Free drink"],["phat-tien-massage-hcmc","Phat Tien Massage","photo/image/9845/photo_2022-09-09_14-46-05__2_.jpg","Massage","Ho Chi Minh City",3.9,"8",0,0,0,""],["shangri-la-go-vap-hcmc","Massage Shangri-La Gò Vấp","photo/image/9964/42855211_349484152456954_1129252863256559616_o-1024x683.jpg","Massage","Ho Chi Minh City",4.5,"10",0,0,0,""],["pa-relax-dubai-hcmc","Massage P.A Relax","photo/image/9312/342201554_189001340194785_2337547238847275601_n.jpg","Massage","Ho Chi Minh City",4.3,"34",0,0,0,""],["neko-massage-hanoi","Neko Massage — La Thành","photo/image/4883/357368546_206897682317604_6661179953863164190_n-1.jpg","Massage","Hanoi",4.1,"159",0,1,0,""],["superior-luxury-spa-surabaya","Superior Luxury Spa","photo/image/12746/414842867_122130932630082699_8185570199946233243_n.jpg","Massage","Surabaya",4.6,"10",0,0,0,""],["volupta-spa-bali","Volupta Spa","photo/image/14735/Volupta_Spa.webp","Massage","Bali",4.4,"35",1,1,0,"Free hot stone upgrade"],["amnesti-spa-bali","Amnesti Spa","photo/image/12580/Screenshot_2024-09-05_at_5.23.27_PM.jpg","Massage","Bali",4.1,"56",0,0,0,""],["mawar-bali-spa-bali","Mawar Bali Spa","photo/image/12518/img-20191215-wa0000.jpg","Massage","Bali",4.8,"10",0,0,0,""],["cinta-salon-and-spa-bali","Cinta Salon and Spa","photo/image/12599/Screenshot_2024-09-05_at_6.13.05_PM.jpg","Massage","Bali",4.6,"9",0,0,0,""],["classic-hotel-jakarta","Classic Hotel Spa","photo/image/12658/spa.jpg","Massage","Jakarta",3.8,"24",0,0,0,""],["lv-spa-bali","LV SPA Bali","photo/image/12484/2024-02-21-1.jpg","Massage","Bali",4,"10",0,0,0,""]];

/* mockup-only: show the two new categories with real venues */
const OVERRIDE_CAT = { 'drake-luxury-lounge-bangkok': 'KTV / Karaoke', 'lumi-nuru-massage-ktv-bangkok': 'KTV / Karaoke', 'katoeys-are-us-pattaya': 'LGBTQ+', 'kink-pattaya-pattaya': 'LGBTQ+' };
Object.assign(CAT_BY_LABEL, { 'KTV / Karaoke': 'ktv', 'LGBTQ+': 'lgbtq' });

/* deterministic pseudo-random so the mockup is stable between reloads */
function seeded(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }

const LISTINGS = RAW.map(r => {
  const [slug, name, img, cat, cityName, rating, reviews, featured, verified, isNew, deal] = r;
  const city = CITIES.find(c => c.name === cityName) || CITIES[0];
  const rnd = seeded(slug);
  const areas = AREAS[city.slug];
  let area = null;
  if (areas) { const pool = areas.flatMap(a => Array(a.weight || 1).fill(a)); area = pool[Math.floor(rnd() * pool.length)]; }
  const base = area || city;
  const thb = cat === 'Massage' ? 1500 + Math.round(rnd() * 20) * 100 : cat === 'Soapy' ? 2800 + Math.round(rnd() * 20) * 100 : 0;
  const FX = { th: 1, vn: 700, id: 450, kh: 0.028, my: 0.13, sg: 0.037 }[city.country] || 1;
  const raw = thb * FX, mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(raw || 1)) - 1));
  const priceFrom = thb ? Math.round(raw / mag) * mag : 0;
  const opens = [11, 12, 13, 14, 18, 19][Math.floor(rnd() * 6)];
  const closes = [0, 1, 2, 3][Math.floor(rnd() * 4)];
  return {
    slug, name, cat: OVERRIDE_CAT[slug] || cat, catSlug: CAT_BY_LABEL[OVERRIDE_CAT[slug] || cat] || 'massage', rating, reviews,
    reviewsNum: parseInt(String(reviews).replace(/\D/g, '')) * (String(reviews).includes('K') ? 1000 : 1) || 0,
    featured: !!featured, verified: !!verified, isNew: !!isNew, deal,
    img: img.startsWith('http') ? img : IMG + img,
    city: city.slug, cityName: city.name, country: city.country,
    area: area && area.slug, areaName: area && area.name,
    lat: (base.lat || 13.73) + (rnd() - 0.5) * (area ? 0.012 : 0.06),
    lng: (base.lng || 100.56) + (rnd() - 0.5) * (area ? 0.012 : 0.06),
    priceFrom, priceLevel: thb > 3000 ? 3 : thb > 2000 ? 2 : 1,
    hours: { opens, closes }, openNow: rnd() > 0.25,
    tags: ['Jacuzzi', 'Private room', 'Couples OK', 'Credit card', 'English spoken', 'Outcall', 'Shower', 'VIP room'].filter(() => rnd() > 0.6).slice(0, 3),
  };
});

/* Listing detail sample — Don Quixote (real content from the live page) */
const DETAIL = {
  slug: 'don-quixote',
  name: 'Don Quixote',
  cats: ['Massage', 'Soapy'],
  address: '25 Soi Sukhumvit 26, Khlong Tan, Khlong Toei, Bangkok 10110',
  area: 'Sukhumvit', city: 'Bangkok', country: 'Thailand',
  phone: '08 8947 4986', line: 'donshop26', whatsapp: '66889474986', telegram: 'donquixote26', website: 'donquixote69.com',
  lat: 13.7282072, lng: 100.570602,
  rating: 4.3, reviewsCount: 35,
  deal: { title: 'Free jacuzzi', detail: 'Free jacuzzi upgrade with any mat room. Say “SwanPass” at the counter or show this page.', expires: 'Ongoing' },
  about: 'Korean-style full-service parlour on Sukhumvit 26, run like a Turkish bath: shower, nuru gel body-to-body, then massage. Every course includes the full nuru service. The manager introduces staff one by one at the counter — tell them what you prefer. Quietest between 3 and 5 pm.',
  photos: ['photo/image/16062/5693.jpg', 'photo/image/16072/S__31055907_0.jpg', 'photo/image/16074/S__31055909_0.jpg', 'photo/image/16073/S__31055908_0.jpg', 'photo/image/16075/S__31055910_0.jpg', 'photo/image/16076/S__31055911_0.jpg', 'photo/image/16077/S__31055912_0.jpg', 'photo/image/16078/S__31055913_0.jpg', 'photo/image/16079/S__31055906_0.jpg', 'photo/image/16080/S__31055915_0.jpg'].map(p => IMG + p),
  menu: [
    { group: 'Full service — Regular room', items: [{ dur: 45, price: 2100 }, { dur: 65, price: 2400 }, { dur: 90, price: 2700 }] },
    { group: 'Full service — Large room with jacuzzi', items: [{ dur: 60, price: 2500 }, { dur: 90, price: 2800 }] },
  ],
  hours: [['Mon', '12:00', '02:00'], ['Tue', '12:00', '02:00'], ['Wed', '12:00', '02:00'], ['Thu', '12:00', '02:00'], ['Fri', '12:00', '03:00'], ['Sat', '12:00', '03:00'], ['Sun', '14:00', '00:00']],
  amenities: ['Jacuzzi', 'Private rooms', 'Shower', 'Nuru gel', 'Lockers', 'Credit card', 'English spoken', 'Korean spoken', 'Free Wi-Fi'],
  reviews: [
    { who: 'SP***', when: '2 months ago', stars: 5, text: 'My favourite place whenever I visit Thailand.', lang: 'en', helpful: 0 },
    { who: 'OB***', when: '3 years ago', stars: 5, text: 'Cheap and good service. I felt better value for money. Completely satisfied.', lang: 'en', helpful: 3 },
    { who: 'MH***', when: '2 years ago', stars: 5, text: 'Minta is very good, the best of service. Full service. Excellent.', lang: 'en', helpful: 5 },
    { who: '김동***', when: '3 years ago', stars: 5, text: '사장님하고 언니들 모두 서비스 다 좋습니다', translated: 'The owner and the staff were all great.', lang: 'ko', helpful: 0 },
    { who: 'SU***', when: '1 year ago', stars: 2, text: 'Staff spent 20 minutes on the bath and ignored what I asked for. Don’t rely only on the manager’s recommendation.', lang: 'en', helpful: 4 },
  ],
  breakdown: { 5: 24, 4: 6, 3: 2, 2: 2, 1: 1 },
};

/* keep the sample venue consistent with its detail page */
Object.assign(LISTINGS.find(l => l.slug === 'don-quixote'), { area: 'phrom-phong', areaName: 'Phrom Phong', lat: DETAIL.lat, lng: DETAIL.lng });
