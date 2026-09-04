import type { Product } from "@/api/products/types";

export const mockProductA: Product = {
  id: 1,
  name: "Neon Ape #1",
  description: "A neon ape from the Starsoft collection.",
  image: "https://softstar.s3.amazonaws.com/products/neon-ape-1.png",
  price: "20",
  createdAt: "2024-01-01T00:00:00.000Z",
};

export const mockProductB: Product = {
  id: 2,
  name: "Pixel Punk #2",
  description: "A pixel punk with rare traits.",
  image: "https://softstar.s3.amazonaws.com/products/pixel-punk-2.png",
  price: "182.00000000",
  createdAt: "2024-01-02T00:00:00.000Z",
};

export const mockProductNoImage: Product = {
  id: 3,
  name: "Ghost NFT",
  description: "No image available.",
  image: "",
  price: "0.5",
  createdAt: "2024-01-03T00:00:00.000Z",
};

export const mockProducts = [mockProductA, mockProductB];
