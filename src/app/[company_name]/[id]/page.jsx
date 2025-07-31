import { use } from "react";
import PropertyDetailsComponent from "../../components/PropertyDetailsComponent";

export default function PropertyDetail({ params }) {
  const { id, company_name } = use(params); // ✅ unwrap with `use`

  return <PropertyDetailsComponent id={id} company={company_name} />;
}
