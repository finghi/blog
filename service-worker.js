if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,d)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let r={};const l=e=>a(e,c),b={module:{uri:c},exports:r,require:l};s[c]=Promise.all(i.map((e=>b[e]||l(e)))).then((e=>(d(...e),r)))}}define(["./workbox-1ab968a5"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/1.html-CASKr5Ss.js",revision:"ea58cba2d5a8234683ac0a56330b1367"},{url:"assets/1.html-De9MpC30.js",revision:"0e16ea907d29591d59faeacccfe502ef"},{url:"assets/2.html-fkRHXsgz.js",revision:"97d46a277a62effbccd3e6d9fde333c8"},{url:"assets/2.html-hLfBpmHB.js",revision:"450bcec5fbd4024685d9f91554495858"},{url:"assets/3.html-CojZdmZ4.js",revision:"078ddc6ac261c6a2448886b6ae7ecba4"},{url:"assets/3.html-CTA2i-Pq.js",revision:"b546ae898be6c78b4567de6d5ceb42f5"},{url:"assets/4.html-Cmw5hTCc.js",revision:"fbc4dffc4a0ce80c8ee930aa88973ca9"},{url:"assets/4.html-CvTH0AV-.js",revision:"1d1b6f248a04e1cf8e236f16ff3ae2be"},{url:"assets/404.html-CvageFMU.js",revision:"3d14165e0b180037112379749b8cd8a2"},{url:"assets/app-1WQ9obxe.js",revision:"f8f399e4f890910ae7c4edb12f8e9488"},{url:"assets/cherry.html-C0M2iLok.js",revision:"e88d7d0f9466118f3ef3c9acd174bce8"},{url:"assets/dads.html-cFDenf_0.js",revision:"0c676776ba16c480d912a4199f42e206"},{url:"assets/disable.html-C_LguywB.js",revision:"29d6ed723c94742e71ef0a1dba4d3476"},{url:"assets/dragonfruit.html-7S9RMCtu.js",revision:"89c012629d7d09f08745a0e2336736dc"},{url:"assets/encrypt.html-JAm7dhPK.js",revision:"db3f7e005f288e8594daba05da88fc58"},{url:"assets/index-DTEEl-sV.js",revision:"46a193641571106d3b7b43f9bc2a2735"},{url:"assets/index.html-207tUBwv.js",revision:"a374b424a3c79321cfc5ec60540a4bad"},{url:"assets/index.html-4l9fE8_C.js",revision:"262cabed7e485e8f135cc04487d1a1b2"},{url:"assets/index.html-b3HQPLEU.js",revision:"922797e91c46d3c9f38e306cebb792d6"},{url:"assets/index.html-BcOon4eg.js",revision:"3ad4ece82344c54d56a660a1460742c6"},{url:"assets/index.html-BEF1wSPK.js",revision:"2229af04d4eae4fc769e81146767706f"},{url:"assets/index.html-BVaiwPyl.js",revision:"72e44adeb48b1936dabb5026b82cf230"},{url:"assets/index.html-BWJIjexa.js",revision:"55c2e5a9fdb3995a2d9f9dfa7057274b"},{url:"assets/index.html-C-xLgZtt.js",revision:"8cbd00e88651c18f911c3152725e5bd7"},{url:"assets/index.html-C0yChr-6.js",revision:"e8219f2643e831593a07e198450123ec"},{url:"assets/index.html-CrKoeFCy.js",revision:"303c1bd24871d0672db3049817690d2e"},{url:"assets/index.html-Csjterr0.js",revision:"0f80eb2947814537aec6b076f18f63a6"},{url:"assets/index.html-CVUC_FGz.js",revision:"7b1b86b7672a0b62cc18ea32f109507f"},{url:"assets/index.html-CwaFG-eD.js",revision:"375ebfb3bf3987edab59202db5924ea5"},{url:"assets/index.html-DHa6f_kz.js",revision:"c12faee56cb289350b1c7e72f49adce2"},{url:"assets/index.html-DKJIV9Lm.js",revision:"f4167b73270c0daf2bfab9116b05e516"},{url:"assets/index.html-DKLjZVNS.js",revision:"468ffe0ff0ba9210c19a09327460ea97"},{url:"assets/index.html-DLSOE849.js",revision:"5410014e2cb7a531b9caf2a5f9517ccd"},{url:"assets/index.html-DOQZVOIP.js",revision:"bc942b9445e1ed6868a5ebf9b2e011ec"},{url:"assets/index.html-DpUhr4ho.js",revision:"6e15f3b11bd627d356aa05c32f8ed6ee"},{url:"assets/index.html-DRX8N7K7.js",revision:"458a2d08c731eec4b47de08f0c9967d8"},{url:"assets/index.html-DRxYQiUv.js",revision:"cee1b24572fe1094a6b250f0fb180a3d"},{url:"assets/index.html-Dss59OiS.js",revision:"32f0ca03dc4a7457eb8c0b11aafef309"},{url:"assets/index.html-DwLn1HS1.js",revision:"1876a202cb6cbd9d4183368e0c602569"},{url:"assets/index.html-DXm4aBb3.js",revision:"c42732eef4a230bd3a0fbe0e703f6a99"},{url:"assets/index.html-ejjDfBQy.js",revision:"d407e49497e36757df7287684fc921f0"},{url:"assets/index.html-k1Z_6nps.js",revision:"75910160eb35f840063f91b6d2f769c9"},{url:"assets/index.html-ljje543m.js",revision:"b5b00a4220b0dd1bd0ed0c3bbd8d6f71"},{url:"assets/index.html-w1Hyivmg.js",revision:"048c0b9e36b78697581c4beef660e772"},{url:"assets/index.html-zNOYsL_5.js",revision:"c368e406b97ab007bb28fdeb78b11e25"},{url:"assets/intro.html-RUl3UzgZ.js",revision:"39e5ac3cc60167a4b077fec37ccd8730"},{url:"assets/layout.html-DvQk5J8U.js",revision:"0bff5b596a3804b999a5724f4cd50973"},{url:"assets/m2.html-BSnrV8PE.js",revision:"be603d8eabc9bcff0530b375a52e315b"},{url:"assets/markdown.html-Drx1ym8m.js",revision:"c33035538d45fc86521df648dff3a8a5"},{url:"assets/my.html-B5ry1GEN.js",revision:"b3912ad2c3041eb904c42fb5e870c129"},{url:"assets/my.html-BxAQjT8w.js",revision:"86bd13fa6b8237d5289ec87b7d0bec58"},{url:"assets/page.html-CyC-c0Z_.js",revision:"c6c385ace662438fac999dd4ca95838c"},{url:"assets/photoswipe.esm-GXRgw7eJ.js",revision:"9252721b01cd263ae52f9296614a7ddb"},{url:"assets/plugin-vue_export-helper-DlAUqK2U.js",revision:"25e3a5dcaf00fb2b1ba0c8ecea6d2560"},{url:"assets/setupDevtools-7MC2TMWH-DenmfF6c.js",revision:"8cdc2fa8b37310a1684da51178c594fa"},{url:"assets/strawberry.html-D39ypDa9.js",revision:"c6337fc51e70594aed76e1f93a03ab79"},{url:"assets/style-Dy3BoVRA.css",revision:"91249294ef6c5f78fc28ef055b1b849e"},{url:"assets/tomato.html-DTHkCNKy.js",revision:"971c4d19032e9f416fd6d77cd2e13ded"},{url:"logo.svg",revision:"1a8e6bd1f66927a7dcfeb4b22f33ffde"},{url:"404.html",revision:"ed4208932aa7374840cbd1d3848e957a"},{url:"article/index.html",revision:"088999dce0cf1a46f036d2c7826abb91"},{url:"blog/dads.html",revision:"bfd19f1801d8b2848824b9f9255edc03"},{url:"blog/golang/index.html",revision:"897814b8641a48200f3298243cdce019"},{url:"blog/golang/m2.html",revision:"77bc03a3c2a675e8c93235532c7185bf"},{url:"blog/golang/my.html",revision:"9866daa0c7ac6c66e853d2ab7bda1a32"},{url:"blog/index.html",revision:"00ac0b4afd06d2dc9d4fbe0dd5b6c9b8"},{url:"blog/my.html",revision:"9be5457ef528e36cd52a242d6f56bf07"},{url:"category/index.html",revision:"aaa0afcc35b2197e1ac3a70fdb501d8a"},{url:"category/樱桃/index.html",revision:"8e0a286bdcc7c19a08c714545dfa2aa8"},{url:"category/水果/index.html",revision:"f10db87c8ffe7b0cc9b3594dc559ddf8"},{url:"category/火龙果/index.html",revision:"5159d86e2851bb71f288d956c3e928b6"},{url:"category/苹果/index.html",revision:"d3a36dc79445a3f4c6cd5d6cb08911ca"},{url:"category/草莓/index.html",revision:"615f217a77bc769e1f832c2647f2049a"},{url:"category/蔬菜/index.html",revision:"1f1995721ae1555ed03a959754430de0"},{url:"category/香蕉/index.html",revision:"1b8320f4fd91f2ba9b903e1d06a0d8e9"},{url:"demo/disable.html",revision:"7d28d870d58e393f1b1b12883caa7dbd"},{url:"demo/encrypt.html",revision:"1603e8facde0ef3f3c8e6c92a081df33"},{url:"demo/index.html",revision:"0b7817b695803d77f1d1ec05e16d221e"},{url:"demo/layout.html",revision:"5eb6596b639bc93d770b22412d78d74d"},{url:"demo/markdown.html",revision:"a8565847e88e9f0828b53a14a9eb2979"},{url:"demo/page.html",revision:"762ef53e92948e75e916ca6766c839e2"},{url:"index.html",revision:"ba77dc9c53ac70ea0d7f105c100dd063"},{url:"intro.html",revision:"331b901dcd788481b4d73ed82d3af5d8"},{url:"posts/apple/1.html",revision:"82693d726e7fc8040aeea8a5df6d5073"},{url:"posts/apple/2.html",revision:"234198f25b8147b8758a2607848d4b47"},{url:"posts/apple/3.html",revision:"47280e3ac9d32811498a90f673b4e9cc"},{url:"posts/apple/4.html",revision:"911890f37def8491439f0ebb2e7ec37c"},{url:"posts/apple/index.html",revision:"40ae6fa8f4717edbe615d3e06bf5b506"},{url:"posts/banana/1.html",revision:"aabcc19fe913dad58debcd4cbf525422"},{url:"posts/banana/2.html",revision:"9c05386a51590eec2b9f4b747d6d4265"},{url:"posts/banana/3.html",revision:"468c360aff19e9e9cbe929f9258fd5e4"},{url:"posts/banana/4.html",revision:"83fd531b92c8b06736811f2c431b7129"},{url:"posts/banana/index.html",revision:"7ec6c6df111a1d45b1ed137466189bd5"},{url:"posts/cherry.html",revision:"2a6c1d7c6acda2ac688ed8c95c736085"},{url:"posts/dragonfruit.html",revision:"cbc63846a84c7e229bf2453a13c2158e"},{url:"posts/index.html",revision:"b5106c8b56d500c4ea6b7182001ae9b2"},{url:"posts/strawberry.html",revision:"8bafa8e8a162cc7b11eda8b12159a62f"},{url:"posts/tomato.html",revision:"0191f1e9d8fea2ab1f0d68ea21fbc572"},{url:"star/index.html",revision:"487dbcbdf79555314d8ca980160e0259"},{url:"tag/-阿萨--第三方都是/index.html",revision:"c330f6e63b4511e9e857d085c1c3d413"},{url:"tag/index.html",revision:"707303b02f3a0eca41103e5ac88af276"},{url:"tag/圆/index.html",revision:"181159561a7cb136a46ec6990d628857"},{url:"tag/大/index.html",revision:"b472594b30c51f22ce6519bbf7010217"},{url:"tag/小/index.html",revision:"19e8cb6233b3fe11d315d052fb502925"},{url:"tag/弯曲的/index.html",revision:"354261a9cc46f59819df7e43b7b9fb3d"},{url:"tag/第三方都是/index.html",revision:"b58156db3509f172441bb7a6562e7337"},{url:"tag/红/index.html",revision:"546655c0aa7b030d28e8d6ede1d0e463"},{url:"tag/长/index.html",revision:"d125dd6d0809db331dc9190beef1513c"},{url:"tag/阿萨/index.html",revision:"41502a70616933986b48662f56eae5b5"},{url:"tag/黄/index.html",revision:"0c293eebce2cf42cffc7c5830ba554c9"},{url:"timeline/index.html",revision:"a25f8fec0da072733bbf57e8480e2cf3"},{url:"assets/icon/apple-icon-152.png",revision:"8b700cd6ab3f7ff38a82ee491bf3c994"},{url:"assets/icon/chrome-192.png",revision:"6d4cd350c650faaed8da00eb05a2a966"},{url:"assets/icon/chrome-512.png",revision:"b08fe93ce982da9d3b0c7e74e0c4e359"},{url:"assets/icon/chrome-mask-192.png",revision:"a05b03eeb7b69dc96355f36f0766b310"},{url:"assets/icon/chrome-mask-512.png",revision:"3c4d57a60277792c6c005494657e1dce"},{url:"assets/icon/guide-maskable.png",revision:"99cc77cf2bc792acd6b847b5e3e151e9"},{url:"assets/icon/ms-icon-144.png",revision:"2fe199405e0366e50ac0442cc4f33a34"},{url:"assets/images/cover1.jpg",revision:"1a661f8cca025ca27a846090c11b86ad"},{url:"assets/images/cover2.jpg",revision:"b228edd2b9054c83cb464d6b1ed8a4ae"},{url:"assets/images/cover3.jpg",revision:"88358b4d02ef94e59f1f563f38a94fad"},{url:"logo.png",revision:"b1cc915c4cbb67972e27267862bcd80a"}],{}),e.cleanupOutdatedCaches()}));
