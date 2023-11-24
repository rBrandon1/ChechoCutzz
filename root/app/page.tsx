"use client";
import "./globals.css";
import { useEffect } from "react";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default function Home() {
  const { user, permissions } = useKindeBrowserClient();

  const createUser = async (userData: any) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to create data.");
      return await res.json();
    } catch (e) {
      throw new Error("Error" + e);
    }
  };

  useEffect(() => {
    if (user) {
      const userData = {
        id: user?.id,
        email: user?.email,
        firstName: user?.given_name,
        lastName: user?.family_name,
        role: permissions?.includes("admin") ? "admin" : "user",
      };
      createUser(userData);
    }
  }, [user, permissions]);

  const Images: number[] = [1, 2, 3, 4, 5, 6];

  return (
    <div>
      <div className="h-[400px] flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#141E30]/75 to-[#243B55]/75 shadow-2xl shadow-[#243B55] rounded-md ">
        <div className="text-2xl md:text-4xl font-bold">
          <h1>Welcome to Checho Cutzz</h1>
        </div>
        <div className="mt-5 flex justify-center">
          <Button asChild className="w-fit">
            <Link href="/book-appointment">Book now</Link>
          </Button>
        </div>
      </div>

      <div className="mt-32 mb-14 md:mb-0">
        <div className="font-bold text-4xl mb-5">
          <span className="flex items-center">
            <h1 className="italic">Gallery</h1>
            <a
              href="https://www.instagram.com/checho.cutzz/"
              target="_blank"
              rel="noreferrer"
              className="ml-5"
            >
              <InstagramLogoIcon className="h-8 w-8 text-[rgb(230,50,105)]" />
            </a>
          </span>
        </div>
        <Swiper
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
              spaceBetween: 10,
            },
            0: {
              slidesPerView: 2,
              spaceBetween: -50,
            },
          }}
          onInit={(swiper) => {
            swiper.slides.forEach((slide) => {
              slide.style.height = "100%";
              slide.style.transition =
                "transform 0.3s, opacity 0.3s ease-in-out";
            });
          }}
          onActiveIndexChange={(swiper) => {
            const activeSlide = swiper.slides[swiper.activeIndex];
            activeSlide.style.transform = "scale(1)";
            activeSlide.style.opacity = "1";
            activeSlide.style.zIndex = "1";

            swiper.slides.forEach((slide, index) => {
              if (index !== swiper.activeIndex) {
                slide.style.transform = "scale(0.9)";
                slide.style.opacity = "0.3";
                slide.style.zIndex = "0";
              }
            });
          }}
        >
          {Images.map((imageNumber) => (
            <SwiperSlide
              key={imageNumber}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                priority
                src={`/imgs/${imageNumber}.png`}
                alt={`Galary Image ${imageNumber}`}
                width={1300}
                height={1500}
                className="h-60 md:h-96 lg:h-[32rem] rounded-lg object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
