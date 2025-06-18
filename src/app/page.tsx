import { ClientWrapper } from "@/components/client-wrapper";
import { getCharacters } from "@/lib/actions";

interface PageProps {
  searchParams: {
    status?: string;
    page?: string;
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const awaitedParams = await searchParams;

  const status = awaitedParams.status || "alive";
  const page = parseInt(awaitedParams.page || "1");

  const initialData = await getCharacters(status, 1);

  return (
    <main className="p-4 pt-12">
      <h1 className="text-2xl font-bold mb-4">
        Rick and Morty Characters (Good Practices)
      </h1>

      <ClientWrapper
        initialCharacters={initialData.data.results}
        initialStatus={status}
        initialPage={page}
      />
    </main>
  );
}
