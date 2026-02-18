import axios from "axios";

const AxiosFetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://xapi.mcartify.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
console.log(
  "process.env.NEXT_PUBLIC_BASE_URL",
  process.env.NEXT_PUBLIC_BASE_URL
);

if (process.env.NEXT_PUBLIC_ENVIRONMENT == "LOCAL") {
  // Dev Store
  // AxiosFetcher.defaults.headers["subdomain"] = "bigbasket";
  // AxiosFetcher.defaults.headers["subdomain"] = "ikeastore";
  // AxiosFetcher.defaults.headers["subdomain"] = "myntra";
  //  AxiosFetcher.defaults.headers["subdomain"] = "prakash5555";
  // AxiosFetcher.defaults.headers["subdomain"] = "foodstore9";
  // AxiosFetcher.defaults.headers["subdomain"] = "juneone";
  // AxiosFetcher.defaults.headers["subdomain"] = "peoplestore";
  // AxiosFetcher.defaults.headers["subdomain"] = "testdomain";
  // AxiosFetcher.defaults.headers["subdomain"] = "venkatastores";
  // AxiosFetcher.defaults.headers["subdomain"] = "nikhil";
  //  AxiosFetcher.defaults.headers["subdomain"] = "newmakeupproducts";
  // AxiosFetcher.defaults.headers["subdomain"] = "thestylealchemist";
  // AxiosFetcher.defaults.headers["subdomain"] = "hyderabadistores";
  // AxiosFetcher.defaults.headers["subdomain"] = "godavariruchulu";
  // AxiosFetcher.defaults.headers["subdomain"] = "sparklecart";
  // AxiosFetcher.defaults.headers["subdomain"] = "toylandtreasures"; 
  // AxiosFetcher.defaults.headers["subdomain"] = "vinyltoys";
  // AxiosFetcher.defaults.headers["subdomain"] = "livinghomestore1";
  AxiosFetcher.defaults.headers["subdomain"] = "mcartifythemetestai-two";
  // AxiosFetcher.defaults.headers["subdomain"] = "gadgetgalaxy";
  // AxiosFetcher.defaults.headers["subdomain"] = "pronutrifile";
  // AxiosFetcher.defaults.headers["subdomain"] = "radiantealth";


    // Product Store
    // AxiosFetcher.defaults.headers["subdomain"] = "testingstore";
}
export { AxiosFetcher };
