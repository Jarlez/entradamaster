import React from "react";
import { type NextPage } from "next";
import CheckoutContent from "../../components/checkout/CheckoutContent";
import Footer from "../../components/principal/footer/Footer";
import Header from "../../components/principal/header/Header";
import sampleImage from "../../public/sample.jpg";

interface Props {
  title: string;
  price: number;
  sector: string;
  cant: number;
  picture: string;
}

const Checkout: NextPage<Props> = ({ title, price, sector, cant, picture }) => {
  return (
    <div>
      <Header buyPage={true} home={true} />
      <section>
        <CheckoutContent
          title={title}
          price={price}
          sector={sector}
          cant={cant}
          picture={picture}
        />
      </section>
      <Footer />
    </div>
  );
};

export default Checkout;

// export async function getServerSideProps(context: any) {
//   const { req } = context;
//   const session = await getSession({ req });

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       title: context.query.title || "",
//       price: context.query.price || 0,
//       sector: context.query.sector || "",
//       cant: context.query.cant || 1,
//       picture: context.query.picture || "",
//       loggedIn: true,
//     },
//   };
// }
