import { getDrawings } from "../actions/save-drawing"
import { PageNavigation } from "@/components/page-navigation"
import Image from "next/image"

export const revalidate = 0 // Disable caching for this page

export default async function DrawingsPage() {
  const { success, data: drawings, error } = await getDrawings(50)

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 pt-16 pb-24">
      <PageNavigation currentPage="Drawings" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-600 dark:text-pink-400">Drawing Gallery ✨</h1>

        {!success && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error || "Failed to load drawings"}</span>
          </div>
        )}

        {success && drawings && drawings.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 dark:text-gray-400">No drawings yet! Be the first to send one.</p>
          </div>
        )}

        {success && drawings && drawings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drawings.map((drawing: any) => (
              <div
                key={drawing.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-pink-200 dark:border-pink-900"
              >
                <div className="p-1 bg-gradient-to-r from-pink-400 to-purple-500">
                  <div className="bg-white dark:bg-gray-800 p-2">
                    <Image
                      src={drawing.drawing_data || "/placeholder.svg"}
                      alt={`Drawing by ${drawing.nickname}`}
                      width={400}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400">
                      {drawing.nickname || "Anonymous"}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(drawing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {drawing.message && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{drawing.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
