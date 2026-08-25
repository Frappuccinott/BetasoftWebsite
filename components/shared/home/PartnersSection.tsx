import React from "react";

const staticPartners = [
  { id: 1, name: "ABB", imageUrl: "https://via.placeholder.com/300x120/e5e5e5/ff000f?text=ABB" },
  { id: 2, name: "EATON", imageUrl: "https://via.placeholder.com/300x120/e5e5e5/005eb8?text=EATON" },
  { id: 3, name: "OMRON", imageUrl: "https://via.placeholder.com/300x120/e5e5e5/005cb9?text=OMRON" },
  { id: 4, name: "Allen-Bradley", imageUrl: "https://via.placeholder.com/300x120/ffffff/003b5c?text=Allen-Bradley" },
  { id: 5, name: "SIEMENS", imageUrl: "https://via.placeholder.com/300x120/e5e5e5/009999?text=SIEMENS" },
  { id: 6, name: "Schneider Electric", imageUrl: "https://via.placeholder.com/300x120/ffffff/3dcd58?text=Schneider" },
];

export function PartnersSection({ 
  partnersImageUrls 
}: { 
  partnersImageUrls?: string[] 
}) {
  const displayPartners = partnersImageUrls && partnersImageUrls.length > 0 
    ? partnersImageUrls.map((url, i) => ({ id: i, name: `Partner ${i}`, imageUrl: url }))
    : staticPartners;

  return (
    <section className="py-24 bg-white border-t border-zinc-100">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 relative inline-block">
            Çözüm Partnerlerimiz
            <span className="absolute -bottom-2 left-0 w-16 h-1 bg-primary"></span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayPartners.map((partner) => (
            <div 
              key={partner.id} 
              className="h-24 bg-white border border-zinc-100 rounded-lg flex items-center justify-center p-4 transition-transform hover:scale-105 duration-300 shadow-sm hover:shadow-md overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={partner.imageUrl} 
                alt={partner.name}
                className="w-full h-full object-contain transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
