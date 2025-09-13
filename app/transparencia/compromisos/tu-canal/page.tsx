import Footer from "@/components/footer"
import TransparencySubmenu from "@/components/transparency/submenu"

export default function TuCanalPage() {
  return (
    <>
      <TransparencySubmenu />
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Tu Canal</h1>
        <div className="prose max-w-none">
          <p>
            Canal del Congreso es el medio de comunicación del Poder Legislativo de los Estados Unidos Mexicanos, que
            tiene como misión reseñar y difundir la actividad legislativa y parlamentaria de las Cámaras del Congreso de
            la Unión y de la Comisión Permanente.
          </p>
          {/* More content would go here */}
        </div>
      </main>
      <Footer />
    </>
  )
}
