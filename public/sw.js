if(!self.define){let e,s={};const t=(t,n)=>(t=new URL(t+".js",n).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(n,i)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let c={};const r=e=>t(e,a),o={module:{uri:a},exports:c,require:r};s[a]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-40bcce23"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"29bdfcd4ef2edc92f051b793622e3db1"},{url:"/_next/static/chunks/117-583ba043896825a9.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/647-e38891478ed8adf0.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/756-be56e6585a037b3a.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/8e1d74a4-827e0c66d6fedcd3.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/948-fc65ab0e55c36781.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/app/_not-found/page-98467b0ee1cfb9b0.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/app/dashboard/%5BuserId%5D/page-fbd36f1f5d85746f.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/app/layout-082bcd56486ef74e.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/app/page-dd721f0b86b21ebb.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/fd9d1056-91aa9495991b9c80.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/main-a6bb921ce423b39a.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/main-app-61655225c7b94e6b.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-03f7c6bc932ce1e3.js",revision:"d2OASR9TJrObNtCjqOTNl"},{url:"/_next/static/css/a4890d822ae4d94b.css",revision:"a4890d822ae4d94b"},{url:"/_next/static/d2OASR9TJrObNtCjqOTNl/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/d2OASR9TJrObNtCjqOTNl/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/logo.d4f0177a.webp",revision:"8ab30bb9cb5b84191472ea090c474d45"},{url:"/assets/fonts/Adam-Bold.ttf",revision:"fa495308ad41f5138bb0bc23ff534536"},{url:"/assets/fonts/Corbert-Regular.ttf",revision:"c8331cebec20d273749fab487e76b273"},{url:"/assets/icons/apple-touch-icon.png",revision:"91bb2d76079b03409613f6a45c9ff2eb"},{url:"/assets/icons/en.webp",revision:"a109c6fd82a3c5553a54789dcb7eba6f"},{url:"/assets/icons/es.webp",revision:"aadbf47906edd9c93d8841924d380113"},{url:"/assets/icons/favicon-48x48.png",revision:"8b0e13979f7780b2a078a5b7070f6567"},{url:"/assets/icons/favicon.ico",revision:"276c8fa579c146aca68856558776b539"},{url:"/assets/icons/favicon.svg",revision:"822347b7bccbd3198e069af9d02c2b9e"},{url:"/assets/icons/icon-192x192.png",revision:"4f7365f76c2fb3ef046b4877f1658970"},{url:"/assets/icons/icon-512x512.png",revision:"f6b6b2d6980ea5abe044e70fbfb312df"},{url:"/assets/icons/icon-96x96.png",revision:"8523c5ada316e8fce02e43789a820a3f"},{url:"/assets/img/logo.webp",revision:"8ab30bb9cb5b84191472ea090c474d45"},{url:"/assets/img/screenshot.png",revision:"9f78f61265cc9b62387ff60200e55641"},{url:"/manifest.json",revision:"55042a4d98e6d7400739fd07933e8f5e"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:t,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/\/_next\/static\/.*/,new e.CacheFirst({cacheName:"static-resources",plugins:[new e.ExpirationPlugin({maxEntries:60,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/.*\.(?:png|jpg|jpeg|svg|gif|webp)/,new e.CacheFirst({cacheName:"image-cache",plugins:[new e.ExpirationPlugin({maxEntries:100,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\.(?:ttf|woff|woff2)$/,new e.CacheFirst({cacheName:"font-cache",plugins:[new e.ExpirationPlugin({maxEntries:20,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^\/_next\/image\?url=.*$/,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^\/$/,new e.NetworkFirst({cacheName:"home-cache",plugins:[new e.ExpirationPlugin({maxEntries:1,maxAgeSeconds:86400}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
