const formatAddress = (args: {
  firstName?: string;
  lastName?: string;
  streetAddress?: string;
  addressLine2?: string;
  city?: string;
  landmark?: string;
  stateName?: string;
  countryName?: string;
  postalCode?: string;
}) => {
  const address = [
    (args?.firstName || "") + " " + (args?.lastName || ""),
    args?.streetAddress,
    args?.addressLine2,
    args?.city,
    args?.landmark,
    args?.stateName,
    args?.countryName,
    args?.postalCode,
  ];

  return address.join(", ");
};

const formatAddressWithoutName = (args: {
  streetAddress?: string;
  addressLine2?: string;
  city?: string;
  landmark?: string;
  stateName?: string;
  countryName?: string;
  postalCode?: string;
}) => {
  const address = [
    args?.streetAddress,
    args?.addressLine2,
    args?.city,
    args?.landmark,
    args?.stateName,
    args?.countryName,
    args?.postalCode,
  ];

  return address.join(", ");
};

export { formatAddress, formatAddressWithoutName };
