// src/pages/event/create.tsx
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { EventStatus } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import { supabase } from "@/lib/supabaseClient";

const FIXED_TICKET_TYPES = [
  "Platea A",
  "Platea B",
  "Platea C",
  "Pullman",
] as const;
type FixedType = (typeof FIXED_TICKET_TYPES)[number];

const eventSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().min(1),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  venueName: z.string(),
  image: z.string().optional(),
  categoryId: z.string().min(1),
  capacity: z.number().min(1).max(150),
  sessions: z.array(
    z.object({
      date: z.string().min(1),
      city: z.string().min(1),
      venueName: z.string().min(1),
    })
  ),
  ticketCategories: z.array(
    z.object({
      title: z.enum(FIXED_TICKET_TYPES),
      price: z.number().min(1),
      quantity: z.number().min(0),
    })
  ),
});

type EventFormInput = z.infer<typeof eventSchema>;

export default function CreateEventPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [sessions, setSessions] = useState<EventFormInput["sessions"]>([
    { date: "", city: "", venueName: "" },
  ]);
  const [tickets, setTickets] = useState<EventFormInput["ticketCategories"]>(
    []
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");

  const { data: categories = [] } = trpc.category.list.useQuery();

  const mutation = trpc.event.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const { register, getValues } = useForm<
    Omit<EventFormInput, "sessions" | "ticketCategories" | "image">
  >({
    resolver: zodResolver(
      eventSchema.omit({ sessions: true, ticketCategories: true, image: true })
    ),
    mode: "onTouched",
  });

  const inputClass =
    "w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-200 placeholder-gray-400";

  const uploadImage = async (): Promise<string | undefined> => {
    if (!imageFile) return imagePreview ?? undefined;
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage
      .from("event-images")
      .upload(fileName, imageFile);
    if (error) throw error;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-images/${fileName}`;
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) return alert("Usuário não autenticado");
    if (!categoryId) return alert("Categoria obrigatória");
    if (!tickets.length)
      return alert("Adicione pelo menos um tipo de ingresso");

    const raw = getValues();
    let image: string | undefined = undefined;

    try {
      image = await uploadImage();
    } catch {
      alert("Erro ao subir imagem");
      return;
    }

    const payload: EventFormInput = {
      ...raw,
      categoryId,
      image,
      sessions,
      ticketCategories: tickets,
    };

    try {
      eventSchema.parse(payload);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Erro de validação:", err.flatten());
        alert("Preencha todos os campos obrigatórios corretamente.");
      } else {
        console.error("Erro desconhecido:", err);
      }
      return;
    }

    mutation.mutate({
      ...payload,
      userId: session.user.id,
      status: EventStatus.OPEN,
      publishedAt: new Date(),
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Criar Evento</h1>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
        <div className="space-y-4 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            Informações Básicas
          </h2>
          <input
            {...register("name" as const)}
            placeholder="Nome do evento"
            className={inputClass}
          />
          <input
            {...register("description" as const)}
            placeholder="Descrição"
            className={inputClass}
          />
          <input
            {...register("slug" as const)}
            placeholder="Slug (URL amigável)"
            className={inputClass}
          />
        </div>

        <div className="space-y-4 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            Informações do evento
          </h2>
          <input
            // {...register("name" as const)}
            placeholder="Artistas do evento"
            className={inputClass}
          />
          <input
            {...register("venueName" as const)}
            placeholder="Local do evento"
            className={inputClass}
          />
          <input
            {...register("capacity", { valueAsNumber: true })}
            type="number"
            placeholder="Capacidade (1 a 150)"
            className={inputClass}
          />
        </div>

        <div className="space-y-4 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-700">Localização</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              {...register("street" as const)}
              placeholder="Rua"
              className={inputClass}
            />
            <input
              {...register("number" as const)}
              placeholder="Número"
              className={inputClass}
            />
            <input
              {...register("neighborhood" as const)}
              placeholder="Bairro"
              className={inputClass}
            />
            <input
              {...register("city" as const)}
              placeholder="Cidade"
              className={inputClass}
            />
            <input
              {...register("state" as const)}
              placeholder="Estado"
              className={inputClass}
            />
            <input
              {...register("zipCode" as const)}
              placeholder="CEP"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-700">Categoria</h2>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Imagem do Evento
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
            className={inputClass}
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">Pré-visualização:</p>
              <div className="relative h-64 w-full overflow-hidden rounded">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Sessões</h2>
          {sessions.map((s, i) => (
            <div key={i} className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                type="date"
                value={s.date}
                onChange={(e) => {
                  const updated = [...sessions];
                  updated[i].date = e.target.value;
                  setSessions(updated);
                }}
                className={inputClass}
              />
              <input
                placeholder="Cidade"
                value={s.city}
                onChange={(e) => {
                  const updated = [...sessions];
                  updated[i].city = e.target.value;
                  setSessions(updated);
                }}
                className={inputClass}
              />
              <input
                placeholder="Local"
                value={s.venueName}
                onChange={(e) => {
                  const updated = [...sessions];
                  updated[i].venueName = e.target.value;
                  setSessions(updated);
                }}
                className={inputClass}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setSessions((prev) => [
                ...prev,
                { date: "", city: "", venueName: "" },
              ])
            }
            className="text-sm text-blue-600 underline"
          >
            + Adicionar sessão
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Ingressos
          </h2>
          {tickets.map((ticket, i) => (
            <div key={i} className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <select
                value={ticket.title}
                onChange={(e) => {
                  const updated = [...tickets];
                  updated[i].title = e.target.value as FixedType;
                  setTickets(updated);
                }}
                className={inputClass}
              >
                {FIXED_TICKET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantidade"
                value={ticket.quantity || ""}
                onChange={(e) => {
                  const updated = [...tickets];
                  updated[i].quantity = Math.max(0, Number(e.target.value));
                  setTickets(updated);
                }}
                className={inputClass}
              />

              <input
                type="number"
                value={ticket.price === 0 ? "" : ticket.price}
                onChange={(e) => {
                  const updated = [...tickets];
                  updated[i].price =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  setTickets(updated);
                }}
                placeholder="Preço"
                className={inputClass}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setTickets((prev) => [
                ...prev,
                {
                  title: "Platea A",
                  price: "" as unknown as number,
                  quantity: 1,
                },
              ])
            }
            className="text-sm text-blue-600 underline"
          >
            + Adicionar ingresso
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="hover:bg-primary-200 rounded bg-primary-100 px-6 py-3 font-semibold text-white transition"
          >
            Criar Evento
          </button>
        </div>
      </form>
    </div>
  );
}
