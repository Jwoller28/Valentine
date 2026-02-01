// =======================
// CONFIG (edit if needed)
// =======================
const PHOTO_COUNT = 16;
const PHOTO_PATH = "assets/photos/";
const PHOTO_PREFIX = "p";
const PHOTO_EXT = ".jpg";

// WhatsApp setup
const PHONE_E164_DIGITS = "17329919747"; // +1 732-991-9747 -> 17329919747
const WHATSAPP_YES_TEXT = "I said YES! TE AMO";

// YouTube embed (Elvis - Can't Help Falling in Love)
// Replace VIDEO_ID if you prefer a different official upload.
const YT_VIDEO_ID = "vGJTaP6anOU"; // common upload of the song

// =======================
// Helpers
// =======================
const $ = (sel) => document.querySelector(sel);

function pad2(n){ return String(n).padStart(2, "0"); }
function fileName(i){
  // p01.jpg ... p16.jpg
  return `${PHOTO_PREFIX}${pad2(i)}${PHOTO_EXT}`;
}

function openWhatsAppYes(){
  const url = `https://wa.me/${PHONE_E164_DIGITS}?text=${encodeURIComponent(WHATSAPP_YES_TEXT)}`;
  window.location.href = url;
}

// =======================
// Song reveal (iOS-friendly)
// =======================
const revealSongBtn = $("#revealSongBtn");
const songFrameWrap = $("#songFrameWrap");

revealSongBtn?.addEventListener("click", () => {
  if (!songFrameWrap) return;
  songFrameWrap.hidden = false;
  revealSongBtn.hidden = true;

  // modest branding, no autoplay (iOS blocks anyway)
  songFrameWrap.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${YT_VIDEO_ID}?rel=0&modestbranding=1"
      title="Can't Help Falling in Love - YouTube player"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  `;
});

// =======================
// Gallery: build 16 photos
// =======================
const grid = $("#photoGrid");

let currentIndex = 1; // 1..PHOTO_COUNT
const lightbox = $("#lightbox");
const lbImg = $("#lbImg");
const lbCaption = $("#lbCaption");
const lbClose = $("#lbClose");
const lbPrev = $("#lbPrev");
const lbNext = $("#lbNext");

function setLightbox(i){
  currentIndex = i;
  const src = PHOTO_PATH + fileName(i);
  if (lbImg) lbImg.src = src;
  if (lbCaption) lbCaption.textContent = `${i} / ${PHOTO_COUNT}`;
}

function openLightbox(i){
  if (!lightbox) return;
  setLightbox(i);
  lightbox.setAttribute("aria-hidden", "false");
  // prevent background scroll
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  if (!lightbox) return;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function prev(){
  const i = currentIndex <= 1 ? PHOTO_COUNT : currentIndex - 1;
  setLightbox(i);
}

function next(){
  const i = currentIndex >= PHOTO_COUNT ? 1 : currentIndex + 1;
  setLightbox(i);
}

function buildGallery(){
  if (!grid) return;

  for (let i = 1; i <= PHOTO_COUNT; i++){
    const btn = document.createElement("button");
    btn.className = "photo";
    btn.type = "button";
    btn.setAttribute("aria-label", `Open photo ${i}`);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = `Photo ${i}`;
    img.src = PHOTO_PATH + fileName(i);

    btn.appendChild(img);
    btn.addEventListener("click", () => openLightbox(i));

    grid.appendChild(btn);
  }
}
buildGallery();

// Lightbox controls
lbClose?.addEventListener("click", closeLightbox);
lbPrev?.addEventListener("click", prev);
lbNext?.addEventListener("click", next);

// Close if tapping backdrop
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard (desktop, but harmless)
window.addEventListener("keydown", (e) => {
  if (!lightbox || lightbox.getAttribute("aria-hidden") === "true") return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
});

// Simple swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

lbImg?.addEventListener("touchstart", (e) => {
  const t = e.changedTouches?.[0];
  if (!t) return;
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

lbImg?.addEventListener("touchend", (e) => {
  const t = e.changedTouches?.[0];
  if (!t) return;

  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  // horizontal swipe threshold
  if (Math.abs(dx) > 40 && Math.abs(dy) < 60){
    if (dx > 0) prev();
    else next();
  }
}, { passive: true });

// =======================
// Valentine buttons
// =======================
const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const message = $("#message");

yesBtn?.addEventListener("click", () => {
  if (message) {
    message.textContent = "You just made my heart explode in the best way. 💘";
  }
  // Small delay so she sees the message before WhatsApp opens
  setTimeout(openWhatsAppYes, 450);
});

let noCount = 0;

noBtn?.addEventListener("click", () => {
  noCount++;

  if (!message) return;

  if (noCount === 1){
    message.textContent = "Mmm… I think your finger slipped 😌";
    wiggle(noBtn);
  } else if (noCount === 2){
    message.textContent = "Okay but… that button is giving “liar” energy 🙈";
    wiggle(noBtn);
  } else if (noCount === 3){
    message.textContent = "I’m going to gently redirect you to the correct answer 💖";
    wiggle(noBtn);
  } else {
    message.textContent = "There we go 🤍";
    // Convert No into Yes (same action)
    noBtn.textContent = "Yes 💘";
    noBtn.classList.remove("no");
    noBtn.classList.add("yes");
    noBtn.onclick = () => yesBtn?.click();
    wiggle(noBtn);
  }
});

function wiggle(btn){
  if (!btn?.animate) return;
  btn.animate(
    [
      { transform:"translateX(0)" },
      { transform:"translateX(-6px)" },
      { transform:"translateX(6px)" },
      { transform:"translateX(-4px)" },
      { transform:"translateX(0)" },
    ],
    { duration: 320, easing: "ease-out" }
  );
}
