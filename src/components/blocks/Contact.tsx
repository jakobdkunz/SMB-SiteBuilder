type Props = {
  phone?: string;
  address?: string;
  email?: string;
};

export default function Contact({ phone, address, email }: Props) {
  return (
    <section className="px-6 py-12 mx-auto max-w-4xl">
      <h2 className="text-2xl font-semibold">Contact</h2>
      <div className="mt-4 space-y-1 text-neutral-700">
        {phone && <p>Phone: {phone}</p>}
        {email && <p>Email: {email}</p>}
        {address && <p>Address: {address}</p>}
      </div>
    </section>
  );
}


