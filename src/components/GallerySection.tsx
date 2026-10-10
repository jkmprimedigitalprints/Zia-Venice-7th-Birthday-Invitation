import React, { useState } from 'react';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Crown } from 'lucide-react';

interface GalleryPhoto {
  slotNumber: number;
  src: string;
  alt: string;
}

// Hardcoded picture names: first.jpg to seven.jpg
const GALLERY_PHOTOS: GalleryPhoto[] = [
  { slotNumber: 1, src: '/first.jpg', alt: 'Zia Venice Photo 1' },
  { slotNumber: 2, src: '/second.jpg', alt: 'Zia Venice Photo 2' },
  { slotNumber: 3, src: '/third.jpg', alt: 'Zia Venice Photo 3' },
  { slotNumber: 4, src: '/fourth.jpg', alt: 'Zia Venice Photo 4' },
  { slotNumber: 5, src: '/fifth.jpg', alt: 'Zia Venice Photo 5' },
  { slotNumber: 6, src: '/sixth.jpg', alt: 'Zia Venice Photo 6' },
  { slotNumber: 7, src: '/seven.jpg', alt: 'Zia Venice Photo 7' },
];

const FALLBACK_IMAGES: Record<number, string> = {
  1: '/src/assets/images/zia_venice_portrait_1_1791473807284.jpg',
  2: '/src/assets/images/zia_venice_portrait_2_1791473818457.jpg',
  3: '/src/assets/images/zia_venice_portrait_3_1791473828543.jpg',
  4: '/src/assets/images/zia_venice_portrait_4_1791473896082.jpg',
  5: '/src/assets/images/zia_venice_portrait_5_1791473907446.jpg',
  6: '/src/assets/images/zia_venice_portrait_6_1791473919171.jpg',
  7: '/src/assets/images/zia_venice_portrait_7_1791473931567.jpg',
};

export const GallerySection: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const mainPhoto = GALLERY_PHOTOS[0];
  const sixPhotos = GALLERY_PHOTOS.slice(1);

  const handleNext = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % GALLERY_PHOTOS.length);
  };

  const handlePrev = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(
      (selectedPhotoIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
    );
  };

  return (
    <section id="gallery" className="relative py-20 px-4 sm:px-6">
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C49A55]/30 bg-white/80 px-4 py-1.5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#C49A55]" />
            <span className="font-poppins text-xs font-semibold tracking-wider text-[#4A7B9D]">
              Royal Gallery · Precious Memories
            </span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#6C567B]">
            Seven Magical Moments
          </h2>
          <p className="mt-2 font-sacramento text-3xl sm:text-4xl text-[#9E4D6E] font-normal">
            Moments with Princess Zia Venice
          </p>
        </div>

        {/* Fairytale Side-by-Side Showcase:
            Side 1: Main Picture (mas pinalaki ang height sa desktop view, full & uncropped)
            Side 2: The 6 Pictures (1 side lang, 2 cols x 3 rows grid, matching height) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {/* Side 1: Main Picture (Full & Uncropped, with tall desktop height matching the 6 photos) */}
          <div
            onClick={() => setSelectedPhotoIndex(0)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-[#C49A55] bg-white shadow-[0_10px_30px_rgba(108,86,123,0.08)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#C49A55] hover:shadow-[0_16px_40px_rgba(196,154,85,0.25)] h-[520px] sm:h-[600px] md:h-[720px] lg:h-[780px]"
          >
            {/* Full uncropped photo container: object-contain with generous space so no part of the photo is cropped */}
            <div className="relative w-full h-full bg-gradient-to-b from-[#FFF9F3] via-[#F8DDE8]/20 to-[#FFF9F3] overflow-hidden flex flex-col items-center justify-between p-3 sm:p-4 md:p-5">
              {/* Badges on top of Main Picture */}
              <div className="w-full flex items-center justify-between z-10 px-1 pt-1 pb-2">
                <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 shadow-xs border border-[#C49A55]/40 text-[#6C567B]">
                  <Crown className="h-4 w-4 text-[#C49A55]" />
                  <span className="font-poppins text-xs font-semibold text-[#6C567B]">
                    Main Royal Portrait
                  </span>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-[#9E4D6E] px-3 py-1.5 text-xs font-semibold text-white shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#FFF9F3]" />
                  <span>Full View</span>
                </div>
              </div>

              {/* Main Photo: Completely full and uncropped, object-contain, tall majestic display */}
              <div className="relative flex-1 w-full flex items-center justify-center min-h-0 py-2">
                <img
                  src={mainPhoto.src}
                  alt={mainPhoto.alt}
                  loading="eager"
                  decoding="async"
                  className="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.02] drop-shadow-md select-none mx-auto"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = FALLBACK_IMAGES[1];
                    if (fallback && target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
              </div>

              {/* Bottom Caption Bar (clean footer bar, not covering the picture) */}
              <div className="w-full mt-2 z-10 flex items-center justify-between rounded-2xl bg-white/95 backdrop-blur-md px-4 py-2.5 border border-[#C49A55]/30 shadow-xs transition-all duration-300 group-hover:bg-white">
                <div>
                  <p className="font-sacramento text-2xl sm:text-3xl lg:text-4xl text-[#9E4D6E] font-normal leading-tight">
                    Princess Zia Venice
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF9F3] border border-[#C49A55]/40 text-[#6C567B] shadow-xs group-hover:scale-105 transition-transform">
                  <Maximize2 className="h-4 w-4 text-[#C49A55]" />
                </div>
              </div>
            </div>
          </div>

          {/* Side 2: The 6 Pictures (1 side lang, 2 cols x 3 rows grid matching height of Main Picture) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 h-[520px] sm:h-[600px] md:h-[720px] lg:h-[780px]">
            {sixPhotos.map((photo, i) => {
              const originalIndex = i + 1; // index in GALLERY_PHOTOS
              return (
                <div
                  key={photo.slotNumber}
                  onClick={() => setSelectedPhotoIndex(originalIndex)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#C49A55]/30 bg-white shadow-[0_4px_16px_rgba(108,86,123,0.06)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#C49A55] hover:shadow-[0_10px_25px_rgba(196,154,85,0.2)] h-full"
                >
                  <div className="relative w-full h-full bg-[#FFF9F3]/80 overflow-hidden flex items-center justify-center p-1 sm:p-1.5">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top rounded-xl transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = FALLBACK_IMAGES[photo.slotNumber];
                        if (fallback && target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#543B59]/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-between p-2.5 rounded-xl">
                      <div className="text-white">
                        <p className="font-playfair text-xs font-semibold">
                          Moment {photo.slotNumber}
                        </p>
                        <p className="font-poppins text-[9px] text-white/80">
                          Click to expand
                        </p>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30 backdrop-blur-xs text-white">
                        <Maximize2 className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Corner Crown Badge */}
                    <div className="absolute top-2.5 left-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-xs border border-[#C49A55]/40 text-[#C49A55]">
                      <Crown className="h-3 w-3" />
                    </div>

                    {/* Slot badge */}
                    <div className="absolute top-2.5 right-2.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-[#6C567B] border border-[#C49A55]/30 shadow-xs">
                      #{photo.slotNumber}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Lightbox - Compact & Small (Maliit lang), Full uncropped photo */}
        {selectedPhotoIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <div
              className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl border-2 border-[#C49A55] bg-white/98 p-3 sm:p-4 shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-[#F8DDE8]">
                <div className="flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-[#C49A55]" />
                  <span className="font-sacramento text-2xl text-[#9E4D6E] font-normal">
                    Princess Zia Venice
                  </span>
                </div>
                <span className="font-poppins text-[10px] font-semibold text-[#4A7B9D] pr-8">
                  {selectedPhotoIndex + 1} of {GALLERY_PHOTOS.length}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-3.5 right-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF9F3] border border-[#C49A55]/40 text-[#6C567B] hover:bg-[#F8DDE8] transition-colors cursor-pointer"
                aria-label="Close photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-[#C49A55]/40 text-[#6C567B] shadow-md hover:bg-[#F8DDE8] transition-colors cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-[#C49A55]/40 text-[#6C567B] shadow-md hover:bg-[#F8DDE8] transition-colors cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Active Image Box - Completely Uncropped (Object Contain) */}
              <div className="relative my-2.5 flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#FFF9F3] via-[#F8DDE8]/20 to-[#FFF9F3] p-2 overflow-hidden border border-[#C49A55]/20">
                <img
                  src={GALLERY_PHOTOS[selectedPhotoIndex].src}
                  alt={GALLERY_PHOTOS[selectedPhotoIndex].alt}
                  className="max-h-[46vh] sm:max-h-[52vh] w-auto max-w-full rounded-xl object-contain mx-auto drop-shadow-sm select-none"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const slot = GALLERY_PHOTOS[selectedPhotoIndex].slotNumber;
                    const fallback = FALLBACK_IMAGES[slot];
                    if (fallback && target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
              </div>

              {/* Modal Caption */}
              <div className="px-2 pt-1 pb-1 text-center">
                <p className="font-playfair text-xs sm:text-sm font-semibold text-[#6C567B]">
                  {selectedPhotoIndex === 0
                    ? 'Main Royal Portrait · Full View'
                    : `Moment ${GALLERY_PHOTOS[selectedPhotoIndex].slotNumber}`}
                </p>
                <p className="font-poppins text-[10px] text-[#4A7B9D]">
                  7th Birthday Fairytale Celebration
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
