"use client";

import { Button } from "@/components/ui/button";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./globals.css";

export default function Home() {
  const Images = [1, 2, 3, 4, 5, 6];
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    Images.reduce((acc, img) => ({ ...acc, [img]: true }), {})
  );
  const handleImageLoaded = (imageNumber: any) => {
    setLoadingStates((prev) => ({ ...prev, [imageNumber]: false }));
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0 modern-gradient">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Welcome to ChechoCutzz
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience premium barbering services tailored to your style
          </p>
          <Button asChild className="hover-scale gradient-button border-0" size="lg">
            <Link href="/book">Book Your Appointment</Link>
          </Button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">Latest Styles</h2>
            <a
              href="https://www.instagram.com/checho.cutzz/"
              target="_blank"
              rel="noreferrer"
              className="hover-scale"
            >
              <InstagramLogoIcon className="h-8 w-8 text-[rgb(230,50,105)]" />
            </a>
          </div>
          
          <Swiper
            className="mySwiper"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={1000}
            centeredSlides={true}
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            pagination={{
              clickable: true,
              bulletActiveClass: "swiper-pagination-bullet-active",
              bulletClass: "swiper-pagination-bullet",
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              0: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
            }}
          >
            {Images.map((imageNumber) => (
              <SwiperSlide key={imageNumber} className="pb-10">
                {loadingStates[imageNumber] && (
                  <div className="flex justify-center items-center h-60 md:h-96">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-ring"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}
                <div className="glass-effect rounded-lg overflow-hidden">
                  <Image
                    src={`/imgs/${imageNumber}.png`}
                    alt={`Gallery Image ${imageNumber}`}
                    width={1300}
                    height={1500}
                    onLoad={() => handleImageLoaded(imageNumber)}
                    className={clsx(
                      "h-60 md:h-96 object-cover hover-scale transition-transform duration-300",
                      { hidden: loadingStates[imageNumber] }
                    )}
                    priority
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect p-6 rounded-lg hover-scale">
              <h3 className="text-xl font-semibold mb-3 gradient-text">Your Style, Your Way</h3>
              <p className="text-muted-foreground">Whether it's sharp fades or natural curls, every cut's done just for you.</p>
            </div>
            <div className="glass-effect p-6 rounded-lg hover-scale">
              <h3 className="text-xl font-semibold mb-3 gradient-text">No Rush, Just Results</h3>
              <p className="text-muted-foreground">Focused on making sure you leave looking your best.</p>
            </div>
            <div className="glass-effect p-6 rounded-lg hover-scale">
              <h3 className="text-xl font-semibold mb-3 gradient-text">Look Good, Feel Good</h3>
              <p className="text-muted-foreground">Competitive pricing that works for you.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
