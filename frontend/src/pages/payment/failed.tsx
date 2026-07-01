import PaymentFailed from "@/components/PaymentFailed";
import PageMetadata from "@/SEO/PageMetadata";

const PaymentFailedPage = () => {
  return (
    <>
      <PageMetadata title="Payment Failed" />
      <PaymentFailed />;
    </>
  );
};

export default PaymentFailedPage;
