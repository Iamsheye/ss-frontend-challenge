import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainSection from "@/components/MainSection";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <>
      <Header />
      <MainSection>
        <main>
          <ProductGridSkeleton />
        </main>
      </MainSection>
      <Footer />
    </>
  );
}
