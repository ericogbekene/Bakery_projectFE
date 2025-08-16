import Container from "@/components/shared/container";
import CartItems from "./CartItems";
import OrderForm from "./OrderForm";

export default function Page() {
  return (
    <main>
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr] my-12 lg:my-16">
        <CartItems />
        <OrderForm />
      </Container>
    </main>
  );
}
